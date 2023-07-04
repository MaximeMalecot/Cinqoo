import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttemptDocument = HydratedDocument<Attempt>;

@Schema()
export class Attempt {
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
    type: Date,
    default: Date.now,
  })
  attemptedAt: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
