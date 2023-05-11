import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
    constructor(
      @Inject("AUTH_SERVICE") private readonly authService: ClientProxy,
    ) {}

    @Get()
    public getAuthHello() {
        return this.authService.send("getHello", {});
    }

    @Get("decode")
    public decodeToken() {
        return this.authService.send("decode_token", {token: "HIHI"});
    }
    
}
