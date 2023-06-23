import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  id: string;

  @Prop({ type: Number, required: true })
  mark: number;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: String, required: true })
  prestationId: string;

  @Prop({ type: String, required: true })
  userId: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
