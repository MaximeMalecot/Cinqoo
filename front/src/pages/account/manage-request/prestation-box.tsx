import { useState } from "react";
import Button from "../../../components/button";
import { ORDER_STATUS } from "../../../constants/status";
import { Order } from "../../../interfaces/order";
import requestService from "../../../services/request.service";
import { displayMsg } from "../../../utils/toast";

interface OrderBoxProps {
    order: Order;
    reload: () => void;
}

export default function PrestationBox({ order, reload }: OrderBoxProps) {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        try {
            await requestService.acceptRequest(order._id);
            reload();
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRefuse = async () => {
        try {
            await requestService.refuseRequest(order._id);
            reload();
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsTerminated = async () => {
        try {
            await requestService.terminateRequest(order._id);
            reload();
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-fit border flex flex-col gap-5 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full shadow-xl">
            <h1 className="text-xl">Prestation details</h1>
            <div className="flex overflow-hidden gap-2">
                <div
                    className="object-contain rounded-md rounded overflow-hidden"
                    style={{ height: "60px", width: "60px" }}
                >
                    <img src={order.prestation.image} alt="" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs" title={order.prestation.name}>
                        {order.prestation.name.length > 20
                            ? order.prestation.name.slice(0, 20) + "..."
                            : order.prestation.name}
                    </p>
                    <button className="cursor-default p-y-1 border border-primary border-1 rounded rounded-md text-primary mt-auto">
                        {order.status}
                    </button>
                </div>
            </div>
            <div className="divider my-0" />
            {order.status === ORDER_STATUS.PENDING && (
                <>
                    <Button visual="primary" onClick={handleAccept}>
                        {loading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        ACCEPT
                    </Button>
                    <Button visual="danger" onClick={handleRefuse}>
                        {loading && (
                            <span className="loading loading-spinner"></span>
                        )}{" "}
                        REFUSE
                    </Button>
                </>
            )}
            {order.status === ORDER_STATUS.IN_PROGRESS && (
                <Button visual="primary" onClick={handleMarkAsTerminated}>
                    {loading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Mark as terminated
                </Button>
            )}
        </div>
    );
}
