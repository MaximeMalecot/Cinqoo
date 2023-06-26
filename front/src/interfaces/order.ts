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
