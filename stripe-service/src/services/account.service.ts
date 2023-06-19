import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/constants';

@Injectable()
export class AccountService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async createAccount() {
    return await this.stripe.accounts.create({
      type: 'express',
    });
  }

  async createAccountLink(accountId: string) {
    return await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/return',
      type: 'account_onboarding',
    });
  }
}
