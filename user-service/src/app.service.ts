import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';
import { Role } from './enums/role.enum';
import { FreelancerProfile } from './schema/freelancer-profile.schema';
import { User } from './schema/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(FreelancerProfile.name)
    private freelancerProfileModel: Model<FreelancerProfile>,
    @Inject('STRIPE_SERVICE') private readonly stripeService: ClientProxy,
  ) {}

  getHello() {
    return this.getUsers();
  }

  async getUsers() {
    return this.userModel.find().exec();
  }

  async getUserById(id: string) {
    const user = await this.userModel
      .findById(new Types.ObjectId(id))
      .select('+password')
      .exec();
    if (!user) {
      throw new RpcException({
        message: `User ${id} not found`,
        statusCode: 404,
      });
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .select('+password')
      .exec();
    if (!user) {
      throw new RpcException({
        message: `User with email ${email} not found`,
        statusCode: 404,
      });
    }
    return user;
  }

  async createUser(data: CreateUserDto) {
    try {
      data.password = await bcrypt.hash(data.password, 10);
      const stripeAccountId = await firstValueFrom(
        this.stripeService.send('STRIPE.CREATE_ACCOUNT', {}),
      );
      data['stripeAccountId'] = stripeAccountId.id;
      const res = new this.userModel(data);
      return await res.save();
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new RpcException({
        message: `User with id ${id} not found`,
        statusCode: 400,
      });
    }
    const emailTaken = await this.userModel.findOne({
      email: updateUserDto.email,
      _id: { $ne: new Types.ObjectId(id) },
    });
    if (emailTaken) {
      throw new RpcException({
        message: `Email ${updateUserDto.email} already used`,
        statusCode: 400,
      });
    }
    try {
      await this.userModel.updateOne(
        { _id: new Types.ObjectId(id) },
        updateUserDto,
      );
      return {
        message: `User with id ${id} updated`,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async updatePwdUser(id: string, updatePwdUserDto: UpdatePwdUserDto) {
    if (updatePwdUserDto.password && !updatePwdUserDto.oldPassword) {
      throw new RpcException({
        message: `Old password is required`,
        statusCode: 400,
      });
    }
    if (updatePwdUserDto.oldPassword) {
      const user = await this.userModel
        .findById(new Types.ObjectId(id))
        .select('+password');
      if (!user) {
        throw new RpcException({
          message: `User with id ${id} not found`,
          statusCode: 400,
        });
      }
      if (!bcrypt.compareSync(updatePwdUserDto.oldPassword, user.password)) {
        throw new RpcException({
          message: `Old password is incorrect`,
          statusCode: 400,
        });
      }
      delete updatePwdUserDto.oldPassword;
    }
    if (updatePwdUserDto.password) {
      updatePwdUserDto.password = await bcrypt.hash(
        updatePwdUserDto.password,
        10,
      );
    }
    try {
      await this.userModel.updateOne(
        { _id: new Types.ObjectId(id) },
        updatePwdUserDto,
      );
      return {
        message: `Password of User with id ${id} updated`,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async removeUser(id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });
    if (!user) {
      throw new RpcException({
        message: `User not found`,
        statusCode: 404,
      });
    }

    return await this.userModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async promoteOrDemoteUserWithStripe(
    stripeAccountId: string,
    promote: boolean,
  ) {
    try {
      const user = await this.userModel.findOne({
        stripeAccountId: stripeAccountId,
      });

      if (!user) {
        throw new RpcException({
          message: `User not found`,
          statusCode: 404,
        });
      }

      if (promote == false) {
        if (user.roles.includes(Role.FREELANCER)) {
          user.roles = user.roles.filter((role) => role !== Role.FREELANCER);
          await user.save();
          return { message: 'User demoted' };
        }
      } else {
        if (!user.roles.includes(Role.FREELANCER)) {
          user.roles.push(Role.FREELANCER);
          await user.save();
          let freelancerProfile = await this.freelancerProfileModel.findOne({
            user: new Types.ObjectId(user._id),
          });
          if (!freelancerProfile) {
            freelancerProfile = new this.freelancerProfileModel({
              user: user._id,
            });
            await freelancerProfile.save();
          }
        }
      }
    } catch (e: any) {
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async becomeFreelancer(id: string) {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new RpcException({
        message: `User with id ${id} not found`,
        statusCode: 400,
      });
    }
    if (user.roles.includes(Role.FREELANCER)) {
      throw new RpcException({
        message: `User with id ${id} is already a freelancer`,
        statusCode: 400,
      });
    }
    const accountLink = await firstValueFrom(
      this.stripeService.send(
        'STRIPE.CREATE_ACCOUNT_LINK',
        user.stripeAccountId,
      ),
    );
    return { url: accountLink.url };
  }
}
