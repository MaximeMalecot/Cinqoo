import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  id?: string;

  @Prop({
    type: Types.ObjectId,
  })
  user: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'reports',
  })
  reportReasion: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
