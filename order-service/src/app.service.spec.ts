import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { AppService } from './app.service';
import { Order, OrderSchema } from './schemas/order.schema';
import {
  MockHybridService,
  MockMailerService,
  MockPaymentService,
  MockPrestationService,
} from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('OrderService', () => {
  let service: AppService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let orderModel: Model<Order>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    orderModel = mongoConnection.model(Order.name, OrderSchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: getModelToken(Order.name), useValue: orderModel },
        { provide: 'PRESTATION_SERVICE', useValue: MockPrestationService },
        { provide: 'PAYMENT_SERVICE', useValue: MockPaymentService },
        { provide: 'MAILER_SERVICE', useValue: MockMailerService },
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

  describe('getAllOrders', () => {
    it('Should return nothing', async () => {
      const r = await service.getAllOrders();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await orderModel.create({
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439011',
        date: new Date(),
      });
      const r = await service.getAllOrders();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getOrdersOfUser', () => {
    it('Should return nothing', async () => {
      const r = await service.getOrdersOfUser(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await orderModel.create({
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439011',
        date: new Date(),
      });
      const r = await service.getOrdersOfUser(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getOrdersOfPrestation', () => {
    it('Should return nothing', async () => {
      const r = await service.getOrdersOfPrestation('507f1f77bcf86cd799439011');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await orderModel.create({
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439012',
        date: new Date(),
      });
      const r = await service.getOrdersOfPrestation('507f1f77bcf86cd799439011');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getOrder', () => {
    it('Should return nothing', async () => {
      const r = service.getOrder('507f1f77bcf86cd799439019');
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
      await orderModel.create({
        _id: '507f1f77bcf86cd799439019',
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439012',
        date: new Date(),
      });
      const r = await service.getOrder('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toBeInstanceOf(orderModel);
    });
  });

  describe('getOrderWithPrestation', () => {
    it('Should return 404 Order not found', async () => {
      const r = service.getOrderWithPrestation('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).rejects.toEqual(
        new RpcException({
          message: 'Order not found',
          statusCode: 404,
        }),
      );
    });

    it('Should return a 404 Prestation not found', async () => {
      await orderModel.create({
        _id: '507f1f77bcf86cd799439019',
        applicant: USER_ID_1,
        serviceId: 'invalidServiceId',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439012',
        date: new Date(),
      });
      const r = service.getOrderWithPrestation('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      await expect(r).rejects.toThrow(
        new RpcException({
          message: 'Prestation not found',
          statusCode: 404,
        }),
      );
    });

    it('Should return something', async () => {
      await orderModel.create({
        _id: '507f1f77bcf86cd799439019',
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439012',
        date: new Date(),
      });
      const r = await service.getOrderWithPrestation(
        '507f1f77bcf86cd799439019',
      );
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r.prestation).toBeDefined();
      expect(r.prestation).toBeInstanceOf(Object);
      expect(Object.keys(r.prestation)).not.toHaveLength(0);
    });
  });

  describe('getAllOrdersWithPrestation', () => {
    afterEach(async () => {
      await orderModel.deleteMany({});
    });

    it('Should return nothing', async () => {
      const r = await service.getAllOrdersWithPrestation();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await orderModel.create({
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439011',
        date: new Date(),
      });
      const r = await service.getAllOrdersWithPrestation();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getUsers', () => {
    afterEach(async () => {
      await orderModel.deleteMany({});
    });

    it('Should return a 404 Order not found', async () => {
      const r = service.getUsers(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).rejects.toEqual(
        new RpcException({
          message: 'Order not found',
          statusCode: 404,
        }),
      );
    });
    it('Should return a 404 Prestation not found', async () => {
      await orderModel.create({
        _id: '507f1f77bcf86cd799439019',
        applicant: USER_ID_1,
        serviceId: 'invalidServiceId',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439012',
        date: new Date(),
      });
      const r = service.getUsers('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).rejects.toThrow(
        new RpcException({
          message: 'Prestation not found',
          statusCode: 404,
        }),
      );
    });
    it('Should return something', async () => {
      const orderId = '507f1f77bcf86cd799439023';
      await orderModel.create({
        _id: orderId,
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439011',
        date: new Date(),
      });
      const r = await service.getUsers(orderId);
      expect(r).toBeDefined();
      expect(r).toHaveProperty('order');
      expect(r).toHaveProperty('users');
      expect(r.users).toHaveLength(2); // Vérifier la longueur des utilisateurs
    });
  });

  describe('getUsers', () => {
    afterEach(async () => {
      await orderModel.deleteMany({});
    });

    it('Should return nothing', async () => {
      const r = service.getUsers(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).rejects.toEqual(
        new RpcException({
          message: 'Order not found',
          statusCode: 404,
        }),
      );
    });

    it('Should return something', async () => {
      const orderId = '507f1f77bcf86cd799439023';
      await orderModel.create({
        _id: orderId,
        applicant: USER_ID_1,
        serviceId: '507f1f77bcf86cd799439011',
        serviceRevisionNb: 1,
        status: 'pending',
        currentRevisionNb: 1,
        billId: '507f1f77bcf86cd799439011',
        date: new Date(),
      });
      const r = await service.getUsers(orderId);
      expect(r).toBeDefined();
      expect(r).toHaveProperty('order');
      expect(r).toHaveProperty('users');
      expect(r.users).toHaveLength(2); // Vérifier la longueur des utilisateurs
    });
  });
});
