import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AccountService } from './services/account.service';
import { PaymentService } from './services/payment-service';
import { WebhookService } from './services/webhook.service';
import {
  MockPaymentService,
  MockStripeClient,
  MockUserService,
} from './tests/clients-proxies';
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        PaymentService,
        WebhookService,
        AccountService,
        { provide: 'STRIPE_CLIENT', useValue: MockStripeClient },
        { provide: 'PAYMENT_SERVICE', useValue: MockPaymentService },
        { provide: 'USER_SERVICE', useValue: MockUserService },
      ],
      // { provide: 'PRESTATION_SERVICE', useValue: MockAuthService },
      //],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Welcome to Cinqoo STRIPE-SERVICE', () => {
      expect(appController.getHello()).toBe('Welcome to Cinqoo STRIPE-SERVICE');
    });
  });
});
