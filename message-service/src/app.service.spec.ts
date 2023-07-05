import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { AppService } from './app.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { MockHybridService, MockOrderService } from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('MessageService', () => {
  let service: AppService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let messageModel: Model<Message>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    messageModel = mongoConnection.model(Message.name, MessageSchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: getModelToken(Message.name), useValue: messageModel },
        { provide: 'ORDER_SERVICE', useValue: MockOrderService },
        { provide: 'HYBRID_SERVICE', useValue: MockHybridService },
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

  describe('getMessagesByOrder', () => {
    it('Should return nothing', async () => {
      const r = service.getMessagesByOrder('507f1f77bcf86cd799439038');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).rejects.toEqual(
        new RpcException({
          message: 'Order not found',
          statusCode: 404,
        }),
      );
    });

    it('Should return something', async () => {
      await messageModel.create({
        content: 'string',
        senderId: USER_ID_1,
        orderId: '507f1f77bcf86cd799439011',
      });

      const r = await service.getMessagesByOrder('507f1f77bcf86cd799439010');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
    });
  });
});
