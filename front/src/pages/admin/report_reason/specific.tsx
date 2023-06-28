import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReportReason } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminReportReason() {
    const { id } = useParams();
    const [reportReason, setReportReason] = useState<ReportReason | null>(null);

    const fetchReportReason = useCallback(async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await reportService.getReportReason(id);
            console.log(res);
            setReportReason(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [id]);

    useEffect(() => {
        fetchReportReason();
    }, []);

    return <div>Report reason</div>;
}
