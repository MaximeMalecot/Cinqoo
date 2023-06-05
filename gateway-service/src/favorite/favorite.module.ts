import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';

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
    ]),
  ],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
