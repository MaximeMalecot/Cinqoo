import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class TransferFundsToConnectAccount {
  @IsString()
  stripeConnectAccountId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  description?: string;
}
