import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('user')
export class UserController {
    constructor(@Inject("USER_SERVICE") private readonly userService: ClientProxy) {}

    @Get()
    public getUserHello() {
        return this.userService.send("getHello", {});
    }
}
