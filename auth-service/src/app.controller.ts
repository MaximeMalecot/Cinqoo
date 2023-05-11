import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DecodeDto } from './dto/decode.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("getHello")
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern("decode_token")
  decodeToken(@Payload() data: DecodeDto){
    return this.appService.decodeToken(data.token);
  }
}
