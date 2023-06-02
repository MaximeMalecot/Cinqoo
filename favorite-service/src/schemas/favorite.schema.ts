import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema()
export class Favorite {
    @Prop({ type: String, required: true })
    prestationId: string;

    @Prop({ type: String, required: true })
    userId: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
