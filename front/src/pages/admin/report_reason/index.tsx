import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
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
    const navigate = useNavigate();

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
        <div className="overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl">Report reasons</h1>
                <Button onClick={() => navigate("/admin/report_reason/create")}>
                    Create
                </Button>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="text-xl">Service reasons</h2>
                <div className="border-2 rounded rounded-md overflow-hidden">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceReportReasons.length > 0 &&
                                serviceReportReasons.map((reason) => (
                                    <tr className="bg-base-200">
                                        <td>{reason._id}</td>
                                        <td>{reason.name}</td>
                                        <td>{reason.description}</td>
                                        <td>
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/report_reason/${reason._id}`
                                                    )
                                                }
                                            >
                                                See
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col gap-3">
                <h2 className="text-xl">User reasons</h2>
                <div className="rounded rounded-md overflow-hidden">
                    <table className="table border-2">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userReportReasons.length > 0 &&
                                userReportReasons.map((reason) => (
                                    <tr className="bg-base-200">
                                        <td>{reason._id}</td>
                                        <td>{reason.name}</td>
                                        <td>{reason.description}</td>
                                        <td>
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/report_reason/${reason._id}`
                                                    )
                                                }
                                            >
                                                See
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
