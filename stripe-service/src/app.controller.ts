import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreatePriceDto } from './dto/create-price.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { HandleWebhookDto } from './dto/handle-webhook.dto';
import { RefundPaymentIntentDto } from './dto/refund-payment-intent.dto';
import { TransferFundsToConnectAccount } from './dto/transfer-fund-to-connect-account.dto';
import { AccountService } from './services/account.service';
import { PaymentService } from './services/payment-service';
import { WebhookService } from './services/webhook.service';

@Controller()
export class AppController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly webhookService: WebhookService,
    private readonly accountService: AccountService,
  ) {}

  // Payment/products

  @EventPattern('STRIPE.CREATE_PRICE')
  async createPrice(@Payload() data: CreatePriceDto) {
    return this.paymentService.createPrice(data);
  }

  @EventPattern('STRIPE.CREATE_PRODUCT')
  async createProduct(@Payload() data: CreateProductDto) {
    return this.paymentService.createProduct(data);
  }

  @EventPattern('STRIPE.CREATE_CHECKOUT_SESSION')
  async createCheckoutSession(@Payload() data: CreateCheckoutSessionDto) {
    return this.paymentService.createCheckoutSession(data);
  }

  @EventPattern('STRIPE.REFUND_PAYMENT_INTENT')
  async refund(@Payload() data: RefundPaymentIntentDto) {
    return this.paymentService.refund(data);
  }

  @EventPattern('STRIPE.TRANSFER_FUNDS')
  async transferFunds(@Payload() data: TransferFundsToConnectAccount) {
    return this.paymentService.transferFunds(data);
  }

  // Webhooks

  @EventPattern('STRIPE.HANDLE_WEBHOOK_DEV')
  async handleWebhookDev(@Payload() data: HandleWebhookDto) {
    return this.webhookService.handleWebhookDev(data);
  }

  @EventPattern('STRIPE.HANDLE_WEBHOOK_PAYMENT')
  async handleWebhookPayment(@Payload() data: HandleWebhookDto) {
    return this.webhookService.handleWebhookPayment(data);
  }

  @EventPattern('STRIPE.HANDLE_WEBHOOK_ACCOUNT')
  async handleWebhookAccount(@Payload() data: HandleWebhookDto) {
    return this.webhookService.handleWebhookAccount(data);
  }
  // Accounts

  @EventPattern('STRIPE.CREATE_ACCOUNT')
  async createAccount() {
    return this.accountService.createAccount();
  }

  @EventPattern('STRIPE.CREATE_ACCOUNT_LINK')
  async createAccountLink(accountId: string) {
    return await this.accountService.createAccountLink(accountId);
  }

  @EventPattern('STRIPE.GET_ACCOUNT_LINK')
  async getAccountLink(accountId: string) {
    return await this.accountService.getAccountLink(accountId);
  }
}
