import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BillDocument = HydratedDocument<Bill>;

export type BillStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'TO_BE_REFUNDED'
  | 'REFUNDED';

@Schema()
export class Bill {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  serviceId: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({
    type: String,
    required: true,
    default: 'PENDING',
  })
  status: BillStatus;

  @Prop({ type: String, required: true, default: 'USD' })
  currency: string;

  @Prop({ type: String, required: false })
  stripeSessionId: string;

  @Prop({ type: String, required: false })
  stripePaymentIntentId?: string;

  @Prop({ type: String, required: false })
  stripeRefundId?: string;

  @Prop({ type: Date, required: false, default: Date.now })
  createdAt: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
