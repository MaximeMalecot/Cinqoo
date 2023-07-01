import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  id?: string;

  @Prop({
    type: String,
  })
  type: 'SERVICE' | 'USER';

  @Prop({
    type: Types.ObjectId,
  })
  target: string;

  @Prop({
    type: Types.ObjectId,
  })
  creator: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
  })
  reportReason: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
