import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { ResultService } from 'src/results/result.service';
import { Result, ResultSchema } from '../results/schemas/result.schema';
import { QuizService } from './quiz.service';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('QuizService', () => {
  let service: QuizService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let quizModel: Model<Quiz>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    quizModel = mongoConnection.model(Quiz.name, QuizSchema);
    const resultModel = mongoConnection.model(Result.name, ResultSchema);
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        ResultService,
        {
          provide: getModelToken(Result.name),
          useValue: resultModel,
        },
        { provide: getModelToken(Quiz.name), useValue: quizModel },
      ],
    }).compile();

    service = app.get<QuizService>(QuizService);
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
      await quizModel.create({
        name: 'Quiz 1',
        description: 'Ceci est un quiz',
        duration: 10,
        questions: [],
      });
      const r = await service.getAll();
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toHaveLength(0);
    });
  });

  describe('getFullQuiz', () => {
    it('Should return nothing', async () => {
      const r = await service.getFullQuiz('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBe(null);
    });

    it('Should return something', async () => {
      await quizModel.create({
        _id: '507f1f77bcf86cd799439019',
        name: 'Quiz 1',
        description: 'Ceci est un quiz',
        duration: 10,
        questions: [
          {
            label: 'Question 1',
            answers: [
              {
                label: 'Réponse 1',
                isRight: true,
              },
              {
                label: 'Réponse 2',
                isRight: false,
              },
            ],
          },
        ],
      });

      const r = await service.getFullQuiz('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toBe(null);
    });
  });

  describe('getPublicQuiz', () => {
    it('Should return nothing', async () => {
      const r = service.getPublicQuiz('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).rejects.toEqual(
        new RpcException({
          message: 'Quiz not found',
          statusCode: 404,
        }),
      );
    });

    it('Should return something', async () => {
      await quizModel.create({
        _id: '507f1f77bcf86cd799439019',
        name: 'Quiz 1',
        description: 'Ceci est un quiz',
        duration: 10,
        questions: [
          {
            label: 'Question 1',
            answers: [
              {
                label: 'Réponse 1',
                isRight: true,
              },
              {
                label: 'Réponse 2',
                isRight: false,
              },
            ],
          },
        ],
      });
      const r = await service.getPublicQuiz('507f1f77bcf86cd799439019');
      expect(r).toBeDefined();
      expect(r).toBeInstanceOf(Object);
      expect(r).not.toBe(null);
    });
  });
});
