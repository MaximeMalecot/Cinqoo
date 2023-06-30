import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DecodeDto } from './dto/decode.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('getHello')
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('login')
  login(@Payload() data: LoginDto) {
    console.log("onéla")
    return this.appService.login(data);
  }

  @EventPattern('decode_token')
  async decodeToken(@Payload() data: DecodeDto) {
    return await this.appService.decodeToken(data.token);
  }
}
