import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('prestation')
export class PrestationController {
    constructor(@Inject("PRESTATION_SERVICE") private readonly prestationService: ClientProxy) {}

    @Get()
    public getPrestationHello() {
        return this.prestationService.send("getHello", {});
    }
}
