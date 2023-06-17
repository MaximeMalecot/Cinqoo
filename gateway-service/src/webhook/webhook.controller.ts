import {
  Controller,
  Headers,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { StripeSignatureGuard } from './guards/check-stripe-signature.pipe';

@Controller('webhook')
@ApiTags('webhook')
export class WebhookController {
  constructor(
    @Inject('STRIPE_SERVICE') private readonly stripeService: ClientProxy,
  ) {}

  @Post('stripe')
  @UseGuards(StripeSignatureGuard)
  @Public()
  public stripeWebhookHandler(
    @Req() req: any,
    @Headers('Stripe-Signature') stripeSig: string,
  ) {
    return this.stripeService.send('STRIPE.HANDLE_WEBHOOK', {
      req: req.rawBody,
      stripeSig,
    });
  }
}
