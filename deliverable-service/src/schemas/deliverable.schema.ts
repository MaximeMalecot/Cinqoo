import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeliverableDocument = HydratedDocument<Deliverable>;

@Schema()
export class Deliverable {
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  link: string;

  @Prop({ type: String, required: true })
  orderId: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const DeliverableSchema = SchemaFactory.createForClass(Deliverable);
