import { Link } from "react-router-dom";
import { Report, ReportReasonEnum } from "../../../interfaces/report";

interface ReportItemProps {
    report: Report;
}

export default function ReportItem({ report }: ReportItemProps) {
    return (
        <tr className="bg-base-200">
            <td>{report._id}</td>
            <td>
                <Link
                    className="underline"
                    to={
                        report.type === ReportReasonEnum.SERVICE
                            ? `/admin/prestations/${report.target}`
                            : `/admin/users/${report.target}`
                    }
                >
                    {report.target}
                </Link>
            </td>
            <td className="text-slate-500">
                <span className="text-black">{report.description}</span>
            </td>
            <td>
                <Link
                    className="underline"
                    to={`/admin/users/${report.creator}`}
                >
                    {report.creator}
                </Link>
            </td>
            <td>{report.createdAt}</td>
        </tr>
    );
}
