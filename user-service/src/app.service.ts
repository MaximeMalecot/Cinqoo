import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { compareSync, hash } from 'bcrypt';
import { Model } from 'mongoose';
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
    const user = await this.userModel.findOne({
      id: id,
    });
    if (!user) {
      throw new RpcException({
        message: `User with id ${id} not found`,
        statusCode: 400,
      });
    }
    try {
      const res = await this.userModel.update({
        where: { id: id },
        data: updateUserDto,
      });
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

  async updatePwdUser(id: string, updatePwdUserDto: UpdatePwdUserDto) {
    if (updatePwdUserDto.password && !updatePwdUserDto.oldPassword) {
      throw new RpcException({
        message: `Old password is required`,
        statusCode: 400,
      });
    }
    if (updatePwdUserDto.oldPassword) {
      const user = await this.userModel
        .findOne({
          id: id,
        })
        .select('+password');
      if (!user) {
        throw new RpcException({
          message: `User with id ${id} not found`,
          statusCode: 400,
        });
      }
      if (!compareSync(updatePwdUserDto.oldPassword, user.password)) {
        throw new RpcException({
          message: `Old password is incorrect`,
          statusCode: 400,
        });
      }
      delete updatePwdUserDto.oldPassword;
    }
    if (updatePwdUserDto.password) {
      updatePwdUserDto.password = await hash(updatePwdUserDto.password, 10);
    }
    try {
      const res = await this.userModel.update({
        where: { id: id },
        data: updatePwdUserDto,
      });
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

  async getUserById(id: string) {
    console.log(id);
    return await this.userModel.findOne({ _id: id });
  }

  async removeUser(id: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: id });
  }
}
