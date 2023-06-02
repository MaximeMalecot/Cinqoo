import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { MongoError, MongoServerError } from 'mongodb';

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

  async getUserById(id: string) {
    console.log(id);
    return await this.userModel.findOne({ _id: id });
  }

  async removeUser(id: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: id });
  }
}
