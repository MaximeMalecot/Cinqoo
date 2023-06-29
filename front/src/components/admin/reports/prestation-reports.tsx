import { useEffect, useState } from "react";
import { Report } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";
import ReportItem from "./report-item";

interface PrestationItemProps {
    prestationId: string;
}

export default function PrestationReports({
    prestationId,
}: PrestationItemProps) {
    const [reports, setReports] = useState<Report[]>([]);

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
    }, [prestationId]);

    return (
        <div>
            <h3 className="text-xl font-bold">Reports</h3>
            {reports.length > 0 &&
                reports.map((report) => (
                    <ReportItem key={report._id} report={report} />
                ))}
        </div>
    );
}
