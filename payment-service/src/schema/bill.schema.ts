import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BillDocument = HydratedDocument<Bill>;

@Schema()
export class Bill {
    @Prop({ type: String, required: true })
    userId: string;
    
    @Prop({ type: String, required: true })
    serviceId: string;

    @Prop({ type: Number, required: true })
    amount: Number;

    @Prop({ type: String, required: true })
    status: string;

    @Prop({ type: String, required: true, default: 'USD' })
    currency: string;

    @Prop({ type: String, required: true })
    stripeId: string;

    @Prop({ type: String, required: true, default: 'card' })
    paymentMethod: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
