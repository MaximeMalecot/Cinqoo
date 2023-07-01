import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReportAdminI, ReportReason } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

interface PrestationItemProps {
    prestationId: string;
}

export default function PrestationReports({
    prestationId,
}: PrestationItemProps) {
    const [reports, setReports] = useState<ReportAdminI[]>([]);
    const [reasons, setReasons] = useState<ReportReason[]>([]);

    const fetchReportReasons = async () => {
        try {
            const res = await reportService.getServiceReasons();
            setReasons(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const fetchReports = async () => {
        try {
            const res = await reportService.getReportsForPrestation(
                prestationId
            );
            console.log(res);
            setReports(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchReports();
        fetchReportReasons();
    }, [prestationId]);

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold">Reports</h3>
            {reports.length === 0 && (
                <p>There is no report for this prestation</p>
            )}
            {reports.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Reported by</th>
                                <th>Reason</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <ReportRowItem
                                    report={report}
                                    reason={reasons.find(
                                        (r) => r._id === report.reportReason
                                    )}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ReportRowItem({
    report,
    reason,
}: {
    report: ReportAdminI;
    reason: ReportReason | undefined;
}) {
    return (
        <tr className="bg-base-200">
            <td>{report._id}</td>
            <td className="text-slate-500">
                <Link
                    to={`/admin/users/${report.creator}`}
                    target={"_blank"}
                    className="underline"
                >
                    {report.creator}
                </Link>
            </td>
            <td className="text-slate-500">
                <Link
                    to={`/admin/report_reason/${reason?._id}`}
                    target={"_blank"}
                    className="underline"
                >
                    {reason?.name ?? report.reportReason}
                </Link>
            </td>
            <td>{report.description ?? "There is no description"}</td>
        </tr>
    );
}
