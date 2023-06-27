import { PrestationItemList } from "./prestation";

export interface OrderItemList {
    _id: string;
    date: Date;
    status: string;
    serviceId: string;
    serviceRevisionNb: number;
    currentRevisionNb: number;
    applicant: string;
    billId: string;
}

export interface SpecificOrder extends OrderItemList {
    prestation: PrestationItemList;
}
