import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { User, UserSchema } from './schema/user.schema';
import {
  FreelancerProfile,
  FreelancerProfileSchema,
} from './schema/freelancer-profile.schema';
import { getModelToken } from '@nestjs/mongoose';

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
});
