import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED'
}

@Schema()
export class Order {
    id: string;

    @Prop({ type: String, required: true })
    applicant: string;
    
    @Prop({ type: String, required: true })
    serviceId: string;

    @Prop({ type: String, required: true })
    status: OrderStatus;

    @Prop({ type: String, required: true })
    billId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
