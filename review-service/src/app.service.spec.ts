import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { AppService } from './app.service';
import { Review, ReviewSchema } from './schema/review.schema';
import { MockOrderService } from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('ReviewService', () => {
  let service: AppService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let reviewModel: Model<Review>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    reviewModel = mongoConnection.model(Review.name, ReviewSchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: getModelToken(Review.name), useValue: reviewModel },
        { provide: 'ORDER_SERVICE', useValue: MockOrderService },
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

  describe('getForPrestation', () => {
    it('Should return nothing', async () => {
      const r = await service.getForPrestation('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await reviewModel.create({
        mark: '150',
        comment: 'Ceci est un commentaire',
        prestationId: '507f1f77bcf86cd799439020',
        userId: '507f1f77bcf86cd799439019',
      });
      const r = await service.getForPrestation('507f1f77bcf86cd799439020');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getByUser', () => {
    it('Should return nothing', async () => {
      const r = await service.getByUser(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await reviewModel.create({
        mark: '150',
        comment: 'Ceci est un commentaire',
        prestationId: '507f1f77bcf86cd799439020',
        userId: USER_ID_1,
      });
      const r = await service.getByUser(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });
});
