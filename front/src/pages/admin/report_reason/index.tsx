import { useEffect, useState } from "react";
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
            console.log(res);
            setServiceReportReasons(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const fecthUserReportReasons = async () => {
        try {
            const res = await reportService.getUserReasons();
            console.log(res);
            setUserReportReasons(res);
        } catch (e: any) {
            console.log(e.message);
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
                        <div key={reason._id}>{JSON.stringify(reason)}</div>
                    ))}
            </div>
            <div>
                <h2>User reasons</h2>
                {userReportReasons.length > 0 &&
                    userReportReasons.map((reason) => (
                        <div key={reason._id}>{JSON.stringify(reason)}</div>
                    ))}
            </div>
        </div>
    );
}
