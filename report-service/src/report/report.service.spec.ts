import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import {
  ReportReason,
  ReportReasonSchema,
} from 'src/report-reason/schema/report-reason.schema';
import {
  MockPrestationService,
  MockStripeService,
  MockUserService,
} from 'src/tests/clients-proxies';
import { ReportService } from './report.service';
import { Report, ReportSchema } from './schema/report.schema';
const USER_ID_1 = '507f1f77bcf86cd799439011';
const USER_ID_2 = '507f1f77bcf86cd799439012';

describe('ReportService', () => {
  let service: ReportService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let reportModel: Model<Report>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    reportModel = mongoConnection.model(Report.name, ReportSchema);
    const reportReasonModel = mongoConnection.model(
      ReportReason.name,
      ReportReasonSchema,
    );

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getModelToken(Report.name), useValue: reportModel },
        {
          provide: getModelToken(ReportReason.name),
          useValue: reportReasonModel,
        },
        { provide: 'STRIPE_SERVICE', useValue: MockStripeService },
        { provide: 'USER_SERVICE', useValue: MockUserService },
        { provide: 'PRESTATION_SERVICE', useValue: MockPrestationService },
      ],
    }).compile();

    service = app.get<ReportService>(ReportService);
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

  describe('getAllReports', () => {
    it('Should return nothing', async () => {
      const r = await service.getAllReports();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await reportModel.create({
        type: 'SERVICE',
        target: '507f1f77bcf86cd799439019',
        creator: USER_ID_2,
        description: 'Lorem ipsum',
        reportReason: '507f1f77bcf86cd799439019',
        createdAt: new Date(),
      });
      const r = await service.getAllReports();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getReportByServices', () => {
    beforeEach(async () => {
      await reportModel.create(
        {
          type: 'SERVICE',
          target: '507f1f77bcf86cd799439019',
          creator: USER_ID_2,
          description: 'Lorem ipsum',
          reportReason: '507f1f77bcf86cd799439019',
          createdAt: new Date(),
        },
        await reportModel.create({
          type: 'USER',
          target: '507f1f77bcf86cd799439020',
          creator: USER_ID_2,
          description: 'Lorem ipsum',
          reportReason: '507f1f77bcf86cd799439019',
          createdAt: new Date(),
        }),
      );
    });
    it('Should return nothing', async () => {
      const r = await service.getReportByService('507f1f77bcf86cd799439018');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return nothing (type user)', async () => {
      const r = await service.getReportByService('507f1f77bcf86cd799439020');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      const r = await service.getReportByService('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });
  describe('getReportsByUser', () => {
    beforeEach(async () => {
      await reportModel.create({
        type: 'USER',
        target: '507f1f77bcf86cd799439019',
        creator: USER_ID_2,
        description: 'Lorem ipsum',
        reportReason: '507f1f77bcf86cd799439019',
        createdAt: new Date(),
      });
    });
    it('Should return nothing', async () => {
      const r = await service.getReportByUser('507f1f77bcf86cd799439018');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      const r = await service.getReportByUser(USER_ID_2);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getReportsOnUser', () => {
    beforeEach(async () => {
      await reportModel.create(
        {
          type: 'SERVICE',
          target: '507f1f77bcf86cd799439019',
          creator: USER_ID_2,
          description: 'Lorem ipsum',
          reportReason: '507f1f77bcf86cd799439019',
          createdAt: new Date(),
        },
        await reportModel.create({
          type: 'USER',
          target: '507f1f77bcf86cd799439020',
          creator: USER_ID_2,
          description: 'Lorem ipsum',
          reportReason: '507f1f77bcf86cd799439019',
          createdAt: new Date(),
        }),
      );
    });
    it('Should return nothing', async () => {
      const r = await service.getReportsOnUser('507f1f77bcf86cd799439018');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return nothing (type service)', async () => {
      const r = await service.getReportsOnUser('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      const r = await service.getReportsOnUser('507f1f77bcf86cd799439020');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });
  describe('getFullUser', () => {
    beforeEach(async () => {
      await reportModel.create(
        {
          type: 'SERVICE',
          target: '507f1f77bcf86cd799439019',
          creator: USER_ID_2,
          description: 'Lorem ipsum',
          reportReason: '507f1f77bcf86cd799439019',
          createdAt: new Date(),
        },
        await reportModel.create({
          type: 'USER',
          target: USER_ID_2,
          creator: USER_ID_1,
          description: 'Lorem ipsum',
          reportReason: '507f1f77bcf86cd799439019',
          createdAt: new Date(),
        }),
      );
    });
    it('Should return nothing', async () => {
      const r = await service.getFullUser('507f1f77bcf86cd799439018');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r.reportsBy).toHaveLength(0);
      expect(r.reportsOn).toHaveLength(0);
    });

    it('Should return something', async () => {
      const r = await service.getFullUser(USER_ID_2);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r.reportsBy).toHaveLength(1);
      expect(r.reportsOn).toHaveLength(1);
    });

    it('Should return something', async () => {
      const r = await service.getFullUser(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r.reportsBy).toHaveLength(1);
      expect(r.reportsOn).toHaveLength(0);
    });
  });
});
