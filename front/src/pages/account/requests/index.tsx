import { useCallback, useEffect, useState } from "react";
import RequestItem from "../../../components/request/request-item";
import { Request } from "../../../interfaces/request";
import requestService from "../../../services/request.service";
import { displayMsg } from "../../../utils/toast";

export default function Requests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [tab, setTab] = useState(0);

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

    useEffect(() => {
        if (tab === 0) {
            fetchRequests();
        } else {
            fetchPendingRequests();
        }
    }, [tab]);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Requests</h1>
                </div>
                <div className="tabs border border-slate-300 border-b-1 border-t-0 border-x-0">
                    <a
                        className={`text-xl tab ${
                            tab === 0 ? "tab-active text-primary" : ""
                        }`}
                        onClick={() => setTab(0)}
                    >
                        All
                    </a>
                    <a
                        className={`text-xl tab ${
                            tab === 1 ? "tab-active text-primary" : ""
                        }`}
                        onClick={() => setTab(1)}
                    >
                        Pending
                    </a>
                </div>
                {requests.length < 0 ? (
                    <p>You have no requests</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {requests.length > 0 ? (
                            requests.map((r, idx) => (
                                <RequestItem request={r} key={idx} />
                            ))
                        ) : (
                            <p>There is no request</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
