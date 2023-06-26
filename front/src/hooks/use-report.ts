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
    const filteredReason = ["USER", "SERVICE"].includes(type)
        ? reasons.filter((reason) => reason.type === type)
        : reasons;

    const fetchReasons = useCallback(async () => {
        try {
            const res = await reportService.getReasons();
            setReasons(res);
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

    return { reasons: filteredReason, loading, error, report };
}
