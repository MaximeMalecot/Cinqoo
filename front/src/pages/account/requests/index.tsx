import { useCallback, useEffect, useState } from "react";
import RequestItem from "../../../components/request/request-item";
import { Request } from "../../../interfaces/request";
import requestService from "../../../services/request.service";
import { displayMsg } from "../../../utils/toast";

export default function Requests() {
    const [requests, setRequests] = useState<Request[]>([]);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await requestService.getAllRequests();
            setRequests(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    const fetchPendingRequests = useCallback(async () => {
        try {
            const res = await requestService.getPendingRequests();
            setRequests(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Requests</h1>
                </div>
                {requests.length < 0 ? (
                    <p>You have no requests</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {requests.map((r, idx) => (
                            <RequestItem request={r} key={idx} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
