import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FreelancerProfileDocument = HydratedDocument<FreelancerProfile>;

@Schema()
export class FreelancerProfile {
  id?: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: String,
  })
  stripeId?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'profile',
  })
  user: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt?: Date;
}

export const FreelancerProfileSchema =
  SchemaFactory.createForClass(FreelancerProfile);
