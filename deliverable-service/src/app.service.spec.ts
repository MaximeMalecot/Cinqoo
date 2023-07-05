import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { AppService } from './app.service';
import { Deliverable, DeliverableSchema } from './schemas/deliverable.schema';
import { MockMailerService, MockOrderService } from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('DeliverableService', () => {
  let service: AppService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let deliverableModel: Model<Deliverable>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    deliverableModel = mongoConnection.model(
      Deliverable.name,
      DeliverableSchema,
    );

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(Deliverable.name),
          useValue: deliverableModel,
        },
        { provide: 'ORDER_SERVICE', useValue: MockOrderService },
        { provide: 'MAILER_SERVICE', useValue: MockMailerService },
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

  describe('getAllDeliverablesForAnOrder', () => {
    afterEach(async () => {
      await deliverableModel.deleteMany({});
    });

    it('Should return an empty array when no deliverables exist for the order', async () => {
      const orderId = '507f1f77bcf86cd799439019';

      const r = await service.getAllDeliverablesForAnOrder(orderId);

      expect(r).toBeDefined();
      expect(Array.isArray(r)).toBe(true);
      expect(r).toHaveLength(0);
    });

    it('Should return an array of deliverables when deliverables exist for the order', async () => {
      const orderId = '507f1f77bcf86cd799439019';

      await deliverableModel.create([
        {
          orderId: orderId,
          name: 'Deliverable 1',
          link: 'https://www.google.com',
        },
        {
          orderId: orderId,
          name: 'Deliverable 2',
          link: 'https://www.google.com',
        },
      ]);

      const r = await service.getAllDeliverablesForAnOrder(orderId);

      expect(r).toBeDefined();
      expect(Array.isArray(r)).toBe(true);
      expect(r).toHaveLength(2);
      expect(r[0].name).toBe('Deliverable 1');
      expect(r[1].name).toBe('Deliverable 2');
    });
  });
});
