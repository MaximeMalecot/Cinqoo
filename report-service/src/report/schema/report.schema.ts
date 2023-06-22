import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  id?: string;

  @Prop({
    type: Types.ObjectId,
  })
  service: string;

  @Prop({
    type: Types.ObjectId,
  })
  target: string;

  @Prop({
    type: Types.ObjectId,
  })
  creator: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'reports',
  })
  reportReason: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
