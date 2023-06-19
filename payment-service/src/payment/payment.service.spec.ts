import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { PaymentService } from './payment.service';
import { Bill, BillSchema } from './schemas/bill.schema';
import {
  MockOrderService,
  MockPrestationService,
  MockStripeService,
} from './tests/client-proxies';

const TMP_USER_ID = '507f1f77bcf86cd799439011';

describe('AppService', () => {
  let service: PaymentService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let billModel: Model<Bill>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    billModel = mongoConnection.model(Bill.name, BillSchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getModelToken(Bill.name), useValue: billModel },
        { provide: 'PRESTATION_SERVICE', useValue: MockPrestationService },
        { provide: 'ORDER_SERVICE', useValue: MockOrderService },
        { provide: 'STRIPE_SERVICE', useValue: MockStripeService },
      ],
    }).compile();

    service = app.get<PaymentService>(PaymentService);
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

  describe('CreatePaymentIntent', () => {
    it('Should return something', async () => {
      const r = await service.createPaymentIntent({
        userId: TMP_USER_ID,
        serviceId: 'serviceId',
      });
      expect(r).toBeDefined();
    });

    it('Should not work: prestation does not exist', async () => {
      const r = service.createPaymentIntent({
        userId: TMP_USER_ID,
        serviceId: 'invalidServiceId',
      });
      await expect(r).rejects.toEqual(
        new RpcException({
          message: 'Prestation not found',
          status: 404,
        }),
      );
    });

    it('Should not work: no stripeCheckoutId generated', async () => {});

    it('Should work', async () => {
      const r = await service.createPaymentIntent({
        userId: TMP_USER_ID,
        serviceId: 'serviceId',
      });
      expect(r).toHaveProperty('url');
    });
  });

  describe('RefundBill', () => {
    it('Should not find bill', async () => {
      const r = service.refundBill('507f1f77bcf86cd799439011');
      await expect(r).rejects.toEqual(
        new RpcException({
          message: 'Bill not found',
          statusCode: 404,
        }),
      );
    });
    it('Should not work: bill has no stripePaymentId ', async () => {
      const newBill = await billModel.create({
        _id: '507f1f77bcf86cd799439011',
        userId: '507f1f77bcf86cd799439011',
        serviceId: 'serviceId',
        stripeSessionId: 'sessionId',
        amount: 100,
      });
      await newBill.save();
      const r = service.refundBill('507f1f77bcf86cd799439011');
      await expect(r).rejects.toEqual(
        new RpcException({
          message: 'Bill has no payment intent id',
          statusCode: 404,
        }),
      );
    });
    it('Should not work: bill status already refunded ', async () => {
      const newBill = await billModel.create({
        _id: '507f1f77bcf86cd799439011',
        userId: '507f1f77bcf86cd799439011',
        serviceId: 'serviceId',
        stripePaymentIntentId: 'pi_1Iyj2n2eZvKYlo2C0Q2Z2Z2Z',
        stripeSessionId: 'sessionId',
        status: 'REFUNDED',
        amount: 100,
      });
      await newBill.save();
      const r = service.refundBill('507f1f77bcf86cd799439011');
      await expect(r).rejects.toEqual(
        new RpcException({
          message: 'Bill already refunded',
          statusCode: 404,
        }),
      );
    });
    it('Should work', async () => {});
  });

  describe('webhook handler', () => {
    // beforeEach(async () => {
    //   const newBill = await billModel.create({
    //     _id: '507f1f77bcf86cd799439011',
    //     userId: '507f1f77bcf86cd799439012',
    //     serviceId: 'serviceId',
    //     amount: 100,
    //     status: 'succeeded',
    //     paymentIntentId: 'pi_1Iyj2n2eZvKYlo2C0Q2Z2Z2Z',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   });
    //   await newBill.save();
    // });

    describe('updatePaymentIntent', () => {});

    describe('confirmPayment', () => {});

    describe('cancelPayment', () => {});
  });
});
