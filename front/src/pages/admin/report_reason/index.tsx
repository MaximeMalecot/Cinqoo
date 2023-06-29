import { useEffect, useState } from "react";
import ReportReasonItem from "../../../components/admin/report-reason/report-reason-item";
import { ReportReason } from "../../../interfaces/report";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminReportReasons() {
    const [serviceReportReasons, setServiceReportReasons] = useState<
        ReportReason[]
    >([]);
    const [userReportReasons, setUserReportReasons] = useState<ReportReason[]>(
        []
    );

    const fetchServiceReportReasons = async () => {
        try {
            const res = await reportService.getServiceReasons();
            setServiceReportReasons(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    const fecthUserReportReasons = async () => {
        try {
            const res = await reportService.getUserReasons();
            setUserReportReasons(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchServiceReportReasons();
        fecthUserReportReasons();
    }, []);

    return (
        <div>
            Report reasons
            <div>
                <h2>Service reasons</h2>
                {serviceReportReasons.length > 0 &&
                    serviceReportReasons.map((reason) => (
                        <ReportReasonItem
                            key={reason._id}
                            report_reason={reason}
                        />
                    ))}
            </div>
            <div>
                <h2>User reasons</h2>
                {userReportReasons.length > 0 &&
                    userReportReasons.map((reason) => (
                        <ReportReasonItem
                            key={reason._id}
                            report_reason={reason}
                        />
                    ))}
            </div>
        </div>
    );
}
