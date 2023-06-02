import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('payment')
export class PaymentController {
    constructor(@Inject("PAYMENT_SERVICE") private readonly paymentService: ClientProxy) {}

    @Get()
    public getPaymentHello() {
        return this.paymentService.send("getHello", {});
    }
}
