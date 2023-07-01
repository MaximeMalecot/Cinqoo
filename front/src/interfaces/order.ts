import { PrestationItemList } from "./prestation";

export enum OrderStatusEnum {
    PENDING = "PENDING",
    REFUSED = "REFUSED",
    IN_PROGRESS = "IN_PROGRESS",
    TERMINATED = "TERMINATED", //When the service provider marks the order as done
    DONE = "DONE", //When the user validates the order is done
    CANCELLED = "CANCELLED",
}

export interface Order {
    _id: string;
    date: Date;
    status: string;
    serviceId: string;
    serviceRevisionNb: number;
    currentRevisionNb: number;
    applicant: string;
    billId: string;
    prestation: PrestationItemList;
}
