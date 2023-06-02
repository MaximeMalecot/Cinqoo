import { ReportType } from 'src/enums/report.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReportReasonDocument = HydratedDocument<ReportReason>;

@Schema()
export class ReportReason {
  id?: string;

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
    type: String,
    enum: ReportType,
    required: true,
  })
  type: ReportType;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'categories' }],
    default: [],
    ref: 'reports',
  })
  reports: string[];
}

export const ReportReasonSchema = SchemaFactory.createForClass(ReportReason);
