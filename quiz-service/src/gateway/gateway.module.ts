import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.AUTH,
          port: PORTS.AUTH,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.USER,
          port: PORTS.USER,
        },
      },
    ]),
  ],
  providers: [SocketGateway, SocketService],
})
export class GatewayModule {}
