export class BroadcastDto {
  message: {
    type: string;
    data: object;
  };
}

export class BroadcastOrderDto {
  message: {
    type: string;
    data: object;
  };
  orderId: string;
}

export class BroadcastUserDto {
  message: {
    type: string;
    data: object;
  };
  userId: string;
}
