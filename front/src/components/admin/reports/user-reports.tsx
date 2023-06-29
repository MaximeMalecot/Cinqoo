import { useEffect, useState } from "react";
import reportService from "../../../services/report.service";
import { displayMsg } from "../../../utils/toast";

interface UserReportsProps {
    userId: string;
}

export default function UserReports({ userId }: UserReportsProps) {
    const [reportsByUser, setReportsByUser] = useState<Report[]>([]);
    const [reportsOnUser, setReportsOnUser] = useState<Report[]>([]);

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
    }, [userId]);

    return (
        <div>
            <h3 className="text-xl font-bold">Reports</h3>
            <h4 className="text-xl font-bold">Reports by User</h4>
            <div>{JSON.stringify(reportsByUser)}</div>
            <h4 className="text-xl font-bold">Reports on User</h4>
            <div>{JSON.stringify(reportsOnUser)}</div>
        </div>
    );
}
