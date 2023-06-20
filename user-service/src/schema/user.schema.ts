import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
  })
  lastname?: string;

  @Prop({
    type: String,
  })
  firstname?: string;

  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
  })
  address?: string;

  @Prop({
    type: String,
  })
  phone?: string;

  @Prop({
    type: String,
  })
  zip?: string;

  @Prop({
    type: String,
  })
  city?: string;

  @Prop({
    type: String,
  })
  country?: string;

  @Prop({
    default: [Role.USER],
  })
  roles: Role[];

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;

  @Prop({
    type: String,
  })
  stripeAccountId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
