import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

export class Category {
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'categories' }],
    default: [],
  })
  prestations: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
