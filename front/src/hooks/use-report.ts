import { useCallback, useEffect, useState } from "react";
import { ReportReason } from "../interfaces/report";
import reportService from "../services/report.service";

interface UseReportProps {
    type: "USER" | "SERVICE";
}

export default function useReport({ type }: UseReportProps) {
    const [reasons, setReasons] = useState<ReportReason[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchReasons = useCallback(async () => {
        try {
            if (type === "USER") {
                const res = await reportService.getUserReasons();
                setReasons(res);
            } else if (type === "SERVICE") {
                const res = await reportService.getServiceReasons();
                setReasons(res);
            }
        } catch (e: any) {
            setError(e.message);
        }
    }, []);

    const report = useCallback(
        async (id: string, reason: string, description: string) => {
            try {
                console.log(reason, description, id);
                setLoading(true);
                await reportService.reportEntity(id, reason, description);
                setLoading(false);
                return { success: true, message: null };
            } catch (e: any) {
                setError(e.message);
                setLoading(false);
                return { success: false, message: e.message };
            }
        },
        []
    );

    useEffect(() => {
        fetchReasons();
    }, []);

    return { reasons, loading, error, report };
}
