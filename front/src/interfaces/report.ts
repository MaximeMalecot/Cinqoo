export interface ReportReason {
    _id: string;
    name: string;
    description: string;
    type: string;
}

export interface Report {
    _id: string;
    service: string;
    target: string;
    creator: string;
    description: string;
    reportReason: ReportReason;
}
