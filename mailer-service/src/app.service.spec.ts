import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MockMailerService, MockUserService } from './tests/clients-proxies';

describe('MailerService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: 'USER_SERVICE', useValue: MockUserService },
        { provide: 'MAILER_CLIENT', useValue: MockMailerService },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Mailer Service"', () => {
      expect(service.getHello()).toBe('Mailer Service');
    });
  });
});
