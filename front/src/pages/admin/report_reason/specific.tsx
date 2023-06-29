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
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [id]);

    useEffect(() => {
        fetchReportReason();
    }, []);

    return (
        <div>
            Report reason {JSON.stringify(reportReason)}
            <div>
                Reports
                {reports.length > 0 &&
                    reports.map((report) => (
                        <ReportItem key={report._id} report={report} />
                    ))}
            </div>
        </div>
    );
}
