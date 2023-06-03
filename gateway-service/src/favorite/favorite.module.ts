import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FAVORITE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'favorite-service',
          port: 3009,
        },
      },
    ]),
  ],
  controllers: [FavoriteController],
})
export class FavoriteModule {}
