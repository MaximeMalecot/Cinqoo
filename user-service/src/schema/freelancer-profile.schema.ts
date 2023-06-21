import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type FreelancerProfileDocument = HydratedDocument<FreelancerProfile>;

@Schema()
export class FreelancerProfile {
  id?: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
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
