import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ResetTokenDocument = HydratedDocument<ResetToken>;

@Schema()
export class ResetToken {
  _id?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  date: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
