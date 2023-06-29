import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  BroadcastDto,
  BroadcastOrderDto,
  BroadcastUserDto,
} from './dto/broadcast.dto';

@Injectable()
export class SseService {
  constructor(
    @Inject('HYBRID_SERVICE') private readonly hybridService: ClientProxy,
  ) {}

  async broadcastAll(data: BroadcastDto) {
    return await firstValueFrom(
      this.hybridService.send('HYBRID.BROADCAST_ALL', data),
    );
  }

  async broadcastOrder(data: BroadcastOrderDto) {
    return await firstValueFrom(
      this.hybridService.send('HYBRID.BROADCAST_ORDER', data),
    );
  }

  async broadcastUser(data: BroadcastUserDto) {
    return await firstValueFrom(
      this.hybridService.send('HYBRID.BROADCAST_USER', data),
    );
  }
}
