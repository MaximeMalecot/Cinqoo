import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { AppService } from './app.service';
import { Role } from './enums/role.enum';
import {
  FreelancerProfile,
  FreelancerProfileSchema,
} from './schema/freelancer-profile.schema';
import { User, UserSchema } from './schema/user.schema';

describe('AppService', () => {
  let service: AppService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let freelancerModel: Model<FreelancerProfile>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    freelancerModel = mongoConnection.model(
      FreelancerProfile.name,
      FreelancerProfileSchema,
    );

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: getModelToken(FreelancerProfile.name),
          useValue: freelancerModel,
        },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('root', () => {
    it('should return an array', async () => {
      expect(Array.isArray(await service.getHello())).toBe(true);
    });
  });

  describe('createUser', () => {
    beforeEach(async () => {
      await service.createUser({
        username: 'testnon',
        email: 'test@testnon.fr',
        password: 'test',
      });
    });

    it('should create a user', async () => {
      const user = await service.createUser({
        username: 'test',
        email: 'test@test.fr',
        password: 'test',
      });
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('username', 'test');
      expect(user).toHaveProperty('email', 'test@test.fr');
      expect(user).toHaveProperty('password');
    });

    it('Should not work: user with this username already exist', async () => {
      const newUser = service.createUser({
        username: 'testnon',
        email: 'test@test.fr',
        password: 'test',
      });
      await expect(newUser).rejects.toEqual(
        new RpcException({
          message: 'username already used',
          statusCode: 400,
        }),
      );
    });

    it('Should not work: user with this email already exist ', async () => {
      const newUser = service.createUser({
        username: 'test',
        email: 'test@testnon.fr',
        password: 'test',
      });
      await expect(newUser).rejects.toEqual(
        new RpcException({
          message: 'email already used',
          statusCode: 400,
        }),
      );
    });
  });

  describe('updateUser', () => {
    beforeEach(async () => {
      const existingUser = await userModel.create({
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        username: 'test',
        email: 'test@test.fr',
        password: 'test',
        Roles: [Role.USER],
      });
      await existingUser.save();
    });

    it('Should not work: user with this id not found', async () => {
      const user = service.updateUser('507f1f77bcf86cd799439014', {
        username: 'testeuuuuh',
        email: 'test@test.fr',
      });
      await expect(user).rejects.toEqual(
        new RpcException({
          message: 'User with id 507f1f77bcf86cd799439014 not found',
          statusCode: 404,
        }),
      );
    });

    it('Should not work: user with this username already exist', async () => {
      const existingUser = await userModel.create({
        _id: new Types.ObjectId('507f1f77bcf86cd799439017'),
        username: 'testnon',
        email: 'test@testnon.fr',
        password: 'test',
        Roles: [Role.USER],
      });
      await existingUser.save();

      const newUser = service.updateUser('507f1f77bcf86cd799439011', {
        username: 'testnon',
        email: 'test@test.fr',
      });
      await expect(newUser).rejects.toEqual(
        new RpcException({
          message: `username already used`,
          statusCode: 400,
        }),
      );
    });

    it('Should not work: user with this email already exist', async () => {
      const existingUser = await userModel.create({
        _id: new Types.ObjectId('507f1f77bcf86cd799439017'),
        username: 'testnon',
        email: 'test@testnon.fr',
        password: 'test',
        Roles: [Role.USER],
      });
      await existingUser.save();

      const newUser = service.updateUser('507f1f77bcf86cd799439011', {
        username: 'test',
        email: 'test@testnon.fr',
      });
      await expect(newUser).rejects.toEqual(
        new RpcException({
          message: `Email test@testnon.fr already used`,
          statusCode: 400,
        }),
      );
    });
  });

  describe('updateUserPassword', () => {
    beforeEach(async () => {
      const existingUser = await userModel.create({
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        username: 'test',
        email: 'test@test.fr',
        password: await bcrypt.hash('test', 10),
        Roles: [Role.USER],
      });
      await existingUser.save();
    });

    it('Should not work: user with this id not found', async () => {
      const user = service.updatePwdUser('507f1f77bcf86cd799439014', {
        oldPassword: 'test',
        password: 'testnon',
      });
      await expect(user).rejects.toEqual(
        new RpcException({
          message: 'User with id 507f1f77bcf86cd799439014 not found',
          statusCode: 404,
        }),
      );
    });

    it('Should not work: Old password is required', async () => {
      const user = service.updatePwdUser('507f1f77bcf86cd799439011', {
        oldPassword: '',
        password: 'testnon',
      });
      await expect(user).rejects.toEqual(
        new RpcException({
          message: 'Old password is required',
          statusCode: 404,
        }),
      );
    });
    it('Should not work: Old password is incorrect', async () => {
      const user = service.updatePwdUser('507f1f77bcf86cd799439011', {
        oldPassword: 'ksdjskdj',
        password: 'testnon',
      });
      await expect(user).rejects.toEqual(
        new RpcException({
          message: 'Old password is incorrect',
          statusCode: 404,
        }),
      );
    });
    it('Should work: update password', async () => {
      const user = service.updatePwdUser('507f1f77bcf86cd799439011', {
        oldPassword: 'test',
        password: 'testnon',
      });
      await expect(user).resolves.toEqual({
        message: `Password of User with id 507f1f77bcf86cd799439011 updated`,
      });
    });
  });
  describe('deleteUser', () => {
    beforeEach(async () => {
      const existingUser = await userModel.create({
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        username: 'test',
        email: 'test@test.fr',
        password: await bcrypt.hash('test', 10),
        Roles: [Role.USER],
      });
      await existingUser.save();
    });
    it('Should not work: user with this id not found', async () => {
      const user = service.removeUser('507f1f77bcf86cd799439014');
      await expect(user).rejects.toEqual(
        new RpcException({
          message: 'User not found',
          statusCode: 404,
        }),
      );
    });
    it('Should work: delete user', async () => {
      const user = service.removeUser('507f1f77bcf86cd799439011');
      await expect(user).resolves.toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });
  });
});
