import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';
import { MockStripeService } from 'src/tests/clients-proxies';
import { PrestationService } from './prestation.service';
import { Prestation, PrestationSchema } from './schemas/prestation.schema';
const USER_ID_1 = '507f1f77bcf86cd799439011';
const USER_ID_2 = '507f1f77bcf86cd799439012';

describe('PrestationService', () => {
  let service: PrestationService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let prestationModel: Model<Prestation>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    prestationModel = mongoConnection.model(Prestation.name, PrestationSchema);
    const categoryModel = mongoConnection.model(Category.name, CategorySchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PrestationService,
        CategoryService,
        { provide: getModelToken(Prestation.name), useValue: prestationModel },
        { provide: getModelToken(Category.name), useValue: categoryModel },
        { provide: 'STRIPE_SERVICE', useValue: MockStripeService },
      ],
    }).compile();

    service = app.get<PrestationService>(PrestationService);
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

  describe('getAll', () => {
    it('Should return nothing', async () => {
      const r = await service.getAll();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await prestationModel.create({
        name: 'SHOULD BE VISIBLE',
        description: 'Lorem ipsum',
        price: 10,
        owner: USER_ID_1,
      });
      const r = await service.getAll();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });

    it('Should not displays an inactive prestation', async () => {
      await prestationModel.create({
        name: 'NOT ACTIVE',
        description: 'Lorem ipsum',
        price: 10,
        isActive: false,
        owner: USER_ID_1,
      });
      const r = await service.getAll();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });
  });

  describe('searchPrestations', () => {
    beforeAll(async () => {
      await Promise.all([
        prestationModel.create({
          name: '#1',
          description: 'Lorem ipsum',
          price: 1,
          owner: USER_ID_1,
        }),
        prestationModel.create({
          name: '#2',
          description: 'Lorem ipsum',
          price: 100,
          owner: USER_ID_2,
        }),
        prestationModel.create({
          name: 'NOT VISIBLE',
          description: 'Lorem ipsum',
          price: 555,
          owner: USER_ID_2,
          isActive: false,
        }),
      ]);
    });

    afterAll(async () => {
      await prestationModel.deleteMany({});
    });

    it('Should only returns #1 prestation', async () => {
      const r = await service.searchPrestations({
        query: undefined,
        price_max: 1,
        price_min: 0,
        categories: undefined,
      });
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(1);
      expect(r[0].name).toBe('#1');
    });

    it('Should only returns #2 prestation', async () => {
      prestationModel.create({
        name: '#2',
        description: 'Lorem ipsum',
        price: 100,
        owner: USER_ID_2,
      });
      const r = await service.searchPrestations({
        query: '#2',
        price_max: undefined,
        price_min: undefined,
        categories: undefined,
      });

      console.log(r);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(1);
      expect(r[0].name).toBe('#2');
    });
  });

  describe('create', () => {
    beforeAll(async () => {
      prestationModel.create({
        _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
        categories: [],
        name: 'NAME OF A PRESTATION',
        description: 'Lorem ipsum',
        revisionNb: 0,
        delay: 0,
        image: 'files/prestations/test.png',
        price: 10,
      });
    });
    it('Should not work', async () => {
      const createPrestation = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
        categories: [],
        name: 'NAME OF A PRESTATION',
        description: 'Lorem ipsum',
        revisionNb: 0,
        delay: 0,
        image: 'files/prestations/test.png',
        price: 10,
      };
      const r = service.create(
        createPrestation,
        USER_ID_1,
        'files/prestations/test.png',
      );
      expect(r).toBeDefined();
      expect(r).rejects.toEqual(
        new RpcException({
          message:
            "E11000 duplicate key error collection: test.prestations index: _id_ dup key: { _id: ObjectId('507f1f77bcf86cd799439012') }",
          statusCode: 500,
        }),
      );
    });

    it('Should work', async () => {
      const createPrestation = await {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        categories: [],
        name: 'NAME OF A PRESTATION',
        description: 'Lorem ipsum',
        revisionNb: 0,
        delay: 0,
        image: 'files/prestations/test.png',
        price: 10,
      };
      const r = await service.create(
        createPrestation,
        USER_ID_1,
        'files/prestations/test.png',
      );
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toEqual(createPrestation);
    });
  });

  describe('getPrestationOfUser', () => {
    it('Should do something', async () => {});
  });

  describe('getActivePrestationsOfUser', () => {
    it('Should do something', async () => {});
  });

  describe('searchPrestations', () => {
    it('Should do something', async () => {});
  });

  describe('getPrestation', () => {
    it('Should do something', async () => {});
  });

  describe('updatePrestation', () => {
    it('Should do something', async () => {});
  });

  describe('disablePrestation', () => {
    it('Should do something', async () => {});
  });

  describe('softDeletePrestationsOfUser', () => {
    it('Should do something', async () => {});
  });

  describe('enablePrestation', () => {
    it('Should do something', async () => {});
  });

  describe('deletePrestation', () => {});
});
