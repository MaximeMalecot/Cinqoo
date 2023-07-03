import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { PaymentService } from './payment.service';
import { Bill, BillSchema } from './schemas/bill.schema';
import {
  MockMailerService,
  MockOrderService,
  MockPrestationService,
  MockStripeService,
  MockUserService,
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
        { provide: 'MAILER_SERVICE', useValue: { MockMailerService } },
        { provide: 'USER_SERVICE', useValue: MockUserService },
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

  describe('Webhook handlers', () => {
    const BILL_ID = '507f1f77bcf86cd799439011';
    const PAYMENT_INTENT_ID = 'paymentIntentId';
    const SESSION_ID = 'sessionId';

    describe('updatePaymentIntent', () => {
      it('Should not work: bill not found', async () => {
        const r = service.updatePaymentIntent({
          paymentIntentId: PAYMENT_INTENT_ID,
          sessionId: SESSION_ID,
        });
        expect(r).rejects.toEqual(
          new RpcException({
            message: 'Bill not found',
            statusCode: 404,
          }),
        );
      });

      it('Should work', async () => {
        const newBill = await billModel.create({
          _id: BILL_ID,
          userId: '507f1f77bcf86cd799439012',
          serviceId: 'serviceId',
          stripeSessionId: SESSION_ID,
          amount: 100,
        });
        await newBill.save();
        const r = service.updatePaymentIntent({
          sessionId: SESSION_ID,
          paymentIntentId: PAYMENT_INTENT_ID,
        });
        await expect(r).resolves.toEqual({
          success: true,
          message: 'Payment intent updated',
        });
        const bill = await billModel.findById(new Types.ObjectId(BILL_ID));
        await expect(bill).toHaveProperty(
          'stripePaymentIntentId',
          PAYMENT_INTENT_ID,
        );
      });
    });

    describe('Updating Bill', () => {
      beforeEach(async () => {
        const newBill = await billModel.create({
          _id: BILL_ID,
          userId: '507f1f77bcf86cd799439012',
          serviceId: 'serviceId',
          amount: 100,
          status: 'PENDING',
          stripePaymentIntentId: PAYMENT_INTENT_ID,
          stripeSessionId: SESSION_ID,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await newBill.save();
      });

      describe('confirmPayment', () => {
        it('Should not work: bill is not pending', async () => {
          await billModel.findByIdAndUpdate(BILL_ID, {
            status: 'PAID',
          });
          const r = service.confirmPayment({
            billId: BILL_ID,
          });
          await expect(r).resolves.toEqual({
            success: true,
            message: 'Bill already processed',
          });
        });

        it('Should work', async () => {
          const r = service.confirmPayment({
            billId: BILL_ID,
          });
          await expect(r).resolves.toEqual({
            success: true,
            message: 'Bill processed',
          });
          const bill = await billModel.findById(BILL_ID);
          expect(bill).toHaveProperty('status', 'PAID');
        });
      });

      describe('cancelPayment', () => {
        it('Should not work: bill is not pending', async () => {
          await billModel.findByIdAndUpdate(BILL_ID, {
            status: 'PAID',
          });
          const r = service.confirmPayment({
            billId: BILL_ID,
          });
          await expect(r).resolves.toEqual({
            success: true,
            message: 'Bill already processed',
          });
        });

        it('Should work', async () => {
          const r = service.cancelPayment({
            billId: BILL_ID,
          });
          await expect(r).resolves.toEqual({
            success: true,
            message: 'Bill canceled',
          });
          const bill = await billModel.findById(BILL_ID);
          expect(bill).toHaveProperty('status', 'FAILED');
        });
      });
    });
  });
});
