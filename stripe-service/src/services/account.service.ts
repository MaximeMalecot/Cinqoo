import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/constants';

@Injectable()
export class AccountService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}
}
