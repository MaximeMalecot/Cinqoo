export class BroadcastDto {
  message: {
    type: string;
    data: object | string;
  };
}

export class BroadcastOrderDto {
  message: {
    type: string;
    data: object | string;
  };
  orderId: string;
}

export class BroadcastUserDto {
  message: {
    type: string;
    data: object | string;
  };
  userId: string;
}
