import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FAVORITE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.FAVORITE,
          port: PORTS.FAVORITE,
        },
      },
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PRESTATION,
          port: PORTS.PRESTATION,
        },
      },
    ]),
  ],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
