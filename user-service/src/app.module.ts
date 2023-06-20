import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SERVICES } from './constants';
import {
  FreelancerProfile,
  FreelancerProfileSchema,
} from './schema/freelancer-profile.schema';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: FreelancerProfile.name, schema: FreelancerProfileSchema },
    ]),
    ClientsModule.register([
      {
        name: 'STRIPE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.STRIPE,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
