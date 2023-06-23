import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  id: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  // @Prop({
  //   type: [{ type: Types.ObjectId, ref: 'categories' }],
  //   default: [],
  // })
  // prestations: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
