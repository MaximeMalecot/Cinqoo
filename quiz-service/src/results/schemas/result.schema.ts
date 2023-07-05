import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  _id?: string;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  quizId: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  success: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  score: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  attemptedAt: Date;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
