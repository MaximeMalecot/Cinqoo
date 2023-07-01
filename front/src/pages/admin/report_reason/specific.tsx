import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReportItem from "../../../components/admin/reports/report-item";
import { Report, ReportReason } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminReportReason() {
    const { id } = useParams();
    const [reportReason, setReportReason] = useState<ReportReason | null>(null);
    const [reports, setReports] = useState<Report[]>([]);

    const fetchReportReason = useCallback(async () => {
        try {
            if (!id) throw new Error("No id provided");
            const { reports, ...reportReason } =
                await reportService.getReportReason(id);
            setReportReason(reportReason);
            setReports(reports);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [id]);

    useEffect(() => {
        fetchReportReason();
    }, [id]);

    if (!reportReason)
        return (
            <div className="flex flex-col">
                <div className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col gap-5">
                    Loading...
                </div>
            </div>
        );

    return (
        <div className="flex flex-col w-full overflow-hidden">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full flex flex-col gap-5">
                    <div className="flex gap-1 items-center flex-col">
                        <h1 className="text-4xl">Nom : {reportReason.name}</h1>
                        <span>Description : {reportReason.description}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="w-full">
                            <h3 className="text-xl font-bold">Reports</h3>
                            {reports.length > 0 && (
                                <div className="border-2 rounded rounded-md overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Target</th>
                                                <th>Description</th>
                                                <th>Creator</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((report) => (
                                                <ReportItem
                                                    key={report._id}
                                                    report={report}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
