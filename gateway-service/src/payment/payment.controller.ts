import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decator';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeSignatureGuard } from './guards/check-stripe-signature.pipe';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentService: ClientProxy,
  ) {}

  @Get()
  public getPaymentHello() {
    return this.paymentService.send('getHello', {});
  }

  @Get('history/self')
  public getSelfBills(@Req() req: any) {
    return this.paymentService.send('PAYMENT.GET_BILLS_OF_USER', req.user._id);
  }

  @Post()
  public createPaymentIntent(
    @Body() body: CreatePaymentIntentDto,
    @Req() req: any,
  ) {
    const data = { ...body, userId: req.user._id };
    return this.paymentService.send('PAYMENT.CREATE_PAYMENT_INTENT', data);
  }
  @Post('/webhook')
  @UseGuards(StripeSignatureGuard)
  @Public()
  public stripeWebhookHandler(
    @Req() req: any,
    @Headers('Stripe-Signature') stripeSig: string,
  ) {
    return this.paymentService.send('PAYMENT.STRIPE_WEBHOOK_HANDLER', {
      data: req.rawBody,
      stripeSig,
    });
  }

  @Get('/webhook')
  @Public()
  public get(@Body() data: any) {
    return 'salut';
  }
}
