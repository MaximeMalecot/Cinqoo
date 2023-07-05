import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MockOrderService } from './tests/clients-proxies';
const USER_ID_1 = '507f1f77bcf86cd799439011';

describe('HybridService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: 'ORDER_SERVICE', useValue: MockOrderService },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('convertMessage', () => {
    it('should convert message object to SSE-formatted string', () => {
      const messageObject = {
        type: 'message',
        id: 1,
        content: 'Hello, world!',
      };
      const expectedSSEString =
        'event: message\n' + 'data: {"id":1,"content":"Hello, world!"}\n\n';
      const convertedMessage = service.convertMessage(messageObject);

      expect(convertedMessage).toEqual(expectedSSEString);
    });

    it('should handle empty data object', () => {
      const messageObject = {
        type: 'event',
      };

      const expectedSSEString = 'event: event\n' + 'data: {}\n\n';

      const convertedMessage = service.convertMessage(messageObject);

      expect(convertedMessage).toEqual(expectedSSEString);
    });

    it('should handle data object with nested properties', () => {
      const messageObject = {
        type: 'data',
        id: 2,
        details: {
          name: 'John',
          age: 30,
        },
      };

      const expectedSSEString =
        'event: data\n' +
        'data: {"id":2,"details":{"name":"John","age":30}}\n\n';

      const convertedMessage = service.convertMessage(messageObject);

      expect(convertedMessage).toEqual(expectedSSEString);
    });
  });
});
