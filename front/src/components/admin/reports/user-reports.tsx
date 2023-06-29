import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReportAdminI, ReportReason } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

interface UserReportsProps {
    userId: string;
}

export default function UserReports({ userId }: UserReportsProps) {
    const [reportsByUser, setReportsByUser] = useState<ReportAdminI[]>([]);
    const [reportsOnUser, setReportsOnUser] = useState<ReportAdminI[]>([]);
    const [reasons, setReasons] = useState<ReportReason[]>([]);

    const fetchReportReasons = async () => {
        try {
            Promise.all([
                reportService.getServiceReasons(),
                reportService.getUserReasons(),
            ]).then(([serviceReasons, userreasons]) => {
                console.log(serviceReasons, userreasons);
                setReasons([...serviceReasons, ...userreasons]);
            });
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const fetchReports = async () => {
        try {
            const res = await reportService.getReportsForUser(userId);
            console.log(res);
            setReportsByUser(res.reportsBy);
            setReportsOnUser(res.reportsOn);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchReports();
        fetchReportReasons();
    }, [userId]);

    return (
        <div className="w-full flex flex-col gap-5">
            <h3 className="text-xl font-bold">Reports</h3>{" "}
            <ReportsByUser reports={reportsByUser} reasons={reasons} />
            <ReportsOnUser reports={reportsOnUser} reasons={reasons} />
        </div>
    );
}

function ReportsByUser({
    reports,
    reasons,
}: {
    reports: ReportAdminI[];
    reasons: ReportReason[];
}) {
    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-md font-medium">Reports made by user</h3>
            {reports.length === 0 && (
                <p className="text-xs text-slate-500">
                    This user has never made any report
                </p>
            )}
            {reports.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Target</th>
                                <th>Description</th>
                                <th>Report reason</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <ReportMadeByUserRowItem
                                    reasons={reasons}
                                    key={index}
                                    report={report}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ReportMadeByUserRowItem({
    report,
    reasons,
}: {
    report: ReportAdminI;
    reasons: ReportReason[];
}) {
    const reason = reasons.find((r) => r._id === report.reportReason);

    return (
        <tr className="hover bg-slate-100">
            <td>
                <Link
                    className="underline"
                    to={
                        report.type === "SERVICE"
                            ? `/admin/prestations/${report.target}`
                            : `/admin/users/${report.target}`
                    }
                >
                    {report.target} ({report.type})
                </Link>
            </td>
            <td>{report.description}</td>
            <td>{reason?.name ?? report.reportReason}</td>
            <td>{report.type}</td>
        </tr>
    );
}

function ReportsOnUser({
    reports,
    reasons,
}: {
    reports: ReportAdminI[];
    reasons: ReportReason[];
}) {
    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-md font-medium">Reports on this user</h3>
            {reports.length === 0 && (
                <p className="text-xs text-slate-500">
                    This user has never been reported ✅
                </p>
            )}
            {reports.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Reported by</th>
                                <th>Description</th>
                                <th>Report reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <ReportOnUserRowItem
                                    key={index}
                                    report={report}
                                    reasons={reasons}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ReportOnUserRowItem({
    report,
    reasons,
}: {
    report: ReportAdminI;
    reasons: ReportReason[];
}) {
    const reason = reasons.find((r) => r._id === report.reportReason);

    return (
        <tr className="hover bg-slate-100">
            <td>
                <Link
                    className="underline"
                    to={`/admin/users/${report.creator}`}
                >
                    {report.creator}
                </Link>
            </td>
            <td>{report.description}</td>
            <td>{reason?.name ?? report.reportReason}</td>
        </tr>
    );
}
