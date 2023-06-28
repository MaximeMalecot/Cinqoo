import { Report } from "../../../interfaces/report";

interface ReportItemProps {
    report: Report;
}

export default function ReportItem({ report }: ReportItemProps) {
    return <div>Report item {JSON.stringify(report)}</div>;
}
