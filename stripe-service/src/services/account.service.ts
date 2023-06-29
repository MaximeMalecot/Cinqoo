import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FRONT_URL } from 'src/constants';
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
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${FRONT_URL}`,
        return_url: `${FRONT_URL}?freelancer_success=true`,
        type: 'account_onboarding',
      });
      return accountLink;
    } catch (e: any) {
      throw new RpcException({
        message: 'Error while creating account link',
        statusCode: 500,
      });
    }
  }

  async getAccountLink(accountId: string) {
    try {
      const loginLink = await this.stripe.accounts.createLoginLink(accountId);
      return loginLink;
    } catch (e: any) {
      throw new RpcException({
        message: 'Error while getting account link',
        statusCode: 500,
      });
    }
  }
}
