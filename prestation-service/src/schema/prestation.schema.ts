import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PrestationDocument = HydratedDocument<Prestation>;

@Schema()
export class Prestation {
  id: string;
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Number,
    default: 0,
  })
  revisionNb: number;

  @Prop({
    type: Number,
  })
  delay: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
  })
  image: string;

  @Prop({
    type: Number,
    default: 0,
  })
  price: number;

  @Prop({
    type: String,
  })
  stripeId: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Types.ObjectId,
  })
  owner: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'categories' }],
    default: [],
  })
  categories: string[];
}

export const PrestationSchema = SchemaFactory.createForClass(Prestation);
