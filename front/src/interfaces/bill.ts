export enum BillStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    TO_BE_REFUNDED = "TO_BE_REFUNDED",
    REFUNDED = "REFUNDED",
}

export interface BillsItemList {
    _id: string;
    serviceId: string;
    amount: number;
    status: string;
    currency: string;
    createdAt: string;
    userId?: string;
}
