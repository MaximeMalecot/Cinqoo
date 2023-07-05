import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MockUserService } from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('AuthService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        JwtService,
        { provide: 'USER_SERVICE', useValue: MockUserService },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });
  describe('getHello', () => {
    it('Should return "Auth service"', () => {
      const result = service.getHello();

      expect(result).toBe('Auth service');
    });
  });
});
