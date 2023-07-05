import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { MockAuthService } from './tests/clients-proxies';
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: 'AUTH_SERVICE', useValue: MockAuthService },
        { provide: 'PRESTATION_SERVICE', useValue: MockAuthService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Welcome to Cinqoo API-GATEWAY', () => {
      expect(appController.getHelloTest()).toBe(
        'Welcome to Cinqoo API-GATEWAY',
      );
    });
  });
});
