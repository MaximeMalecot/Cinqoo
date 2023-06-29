import { ReportReason } from "../../../interfaces/report";

interface ReportReasonProps {
    report_reason: ReportReason;
}

export default function ReportReasonItem({ report_reason }: ReportReasonProps) {
    return <>{JSON.stringify(report_reason)}</>;
}
