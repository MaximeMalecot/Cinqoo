export type ReportReasonType = "USER" | "SERVICE";

export enum ReportReasonEnum {
    "USER" = "USER",
    "SERVICE" = "SERVICE",
}

export interface ReportReason {
    _id: string;
    name: string;
    description: string;
    type: ReportReasonType;
}

export interface Report {
    _id: string;
    service: string;
    target: string;
    creator: string;
    description: string;
    reportReason: ReportReason;
}

export interface ReportAdminI {
    _id: string;
    service: string;
    target: string;
    creator: string;
    description: string;
    reportReason: string;
    type: "USER" | "SERVICE";
}

export interface ReportReasonFormData {
    name: string;
    description: string;
}
