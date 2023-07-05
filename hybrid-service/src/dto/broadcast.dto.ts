import { MessageType } from "src/enums/message.enum";

export class BroadcastDto {
  message: {
    type: MessageType;
    data: any;
  };
}

export class BroadcastOrderDto extends BroadcastDto {
  orderId: string;
}

export class BroadcastUserDto extends BroadcastDto {
  userId: string;
}
