import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BillDocument = HydratedDocument<Bill>;

export type BillStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

@Schema()
export class Bill {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  serviceId: string;

  @Prop({ type: Number, required: true })
  amount: Number;

  @Prop({
    type: String,
    required: true,
    default: 'PENDING',
  })
  status: BillStatus;

  @Prop({ type: String, required: true, default: 'USD' })
  currency: string;

  @Prop({ type: String, required: true })
  stripeId: string;

  @Prop({ type: String, required: true, default: 'card' })
  paymentMethod: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
