import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { AppService } from './app.service';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { MockPrestationService } from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('FavoriteService', () => {
  let service: AppService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let favoriteModel: Model<Favorite>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    favoriteModel = mongoConnection.model(Favorite.name, FavoriteSchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: getModelToken(Favorite.name), useValue: favoriteModel },
        { provide: 'PRESTATION_SERVICE', useValue: MockPrestationService },
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

  describe('getSelfFavorites', () => {
    it('Should return nothing', async () => {
      const r = await service.getSelfFavorites(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).toHaveLength(0);
    });

    it('Should return something', async () => {
      await favoriteModel.create({
        prestationId: '507f1f77bcf86cd799439011',
        userId: USER_ID_1,
      });
      const r = await service.getSelfFavorites(USER_ID_1);
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });
  describe('getSpecificFavorite', () => {
    afterEach(async () => {
      await favoriteModel.deleteMany({});
    });

    it('Should return isFavorite true when favorite exists', async () => {
      const favoriteData = {
        prestationId: '507f1f77bcf86cd799439011',
        userId: USER_ID_1,
      };

      await favoriteModel.create(favoriteData);

      const r = await service.getSpecificFavorite(favoriteData);

      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r.isFavorite).toBe(true);
    });

    it('Should return isFavorite false when favorite does not exist', async () => {
      const favoriteData = {
        prestationId: '507f1f77bcf86cd799439011',
        userId: USER_ID_1,
      };

      const r = await service.getSpecificFavorite(favoriteData);

      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r.isFavorite).toBe(false);
    });
  });
});
