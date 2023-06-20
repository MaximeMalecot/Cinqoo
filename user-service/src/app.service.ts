import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
        statusCode: 404,
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
}
