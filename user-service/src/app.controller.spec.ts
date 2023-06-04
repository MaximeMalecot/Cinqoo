import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import {
  FreelancerProfile,
  FreelancerProfileSchema,
} from './schema/freelancer-profile.schema';
import { User, UserSchema } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let controller: AppController;
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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: getModelToken(FreelancerProfile.name),
          useValue: freelancerModel,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
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
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return an array', async () => {
      const users = await controller.getHello();
      expect(Array.isArray(users)).toBe(true);
    });
  });
});
