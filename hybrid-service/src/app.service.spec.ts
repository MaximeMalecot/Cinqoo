import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MessageType } from './enums/message.enum';
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
      const messageDto = {
        type: MessageType.NEW_MESSAGE,
        data: {
          id: 1,
          content: 'Hello, world!',
        },
      };
      const expectedSSEString =
        'event: new_message\n' + 'data: {"id":1,"content":"Hello, world!"}\n\n';
      const convertedMessage = service.convertMessage(messageDto);

      expect(convertedMessage).toEqual(expectedSSEString);
    });

    it('should handle empty data object', () => {
      const messageDto = {
        type: MessageType.NEW_MESSAGE,
        data: {},
      };

      const expectedSSEString = 'event: new_message\n' + 'data: {}\n\n';

      const convertedMessage = service.convertMessage(messageDto);

      expect(convertedMessage).toEqual(expectedSSEString);
    });

    it('should handle data object with nested properties', () => {
      const messageDto = {
        type: MessageType.NEW_MESSAGE,
        data: {
          id: 2,
          details: {
            name: 'John',
            age: 30,
          },
        },
      };

      const expectedSSEString =
        'event: new_message\n' +
        'data: {"id":2,"details":{"name":"John","age":30}}\n\n';

      const convertedMessage = service.convertMessage(messageDto);

      expect(convertedMessage).toEqual(expectedSSEString);
    });
  });
});
