import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button";
import { Order } from "../../../interfaces/order";
import requestService from "../../../services/request.service";
import { displayMsg } from "../../../utils/toast";

interface OrderBoxProps {
    order: Order;
    reload: () => void;
}

export default function PrestationBox({ order, reload }: OrderBoxProps) {
    const [loading, setLoading] = useState(false);

    const handleRevision = async () => {
        try {
            setLoading(true);
            await requestService.startRevision(order._id);
            reload();
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFinalization = async () => {
        try {
            setLoading(true);
            await requestService.confirmFinalizationRequest(order._id);
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
                    className="object-contain rounded-md rounded overflow-hidden bg-slate-300"
                    style={{ height: "60px", width: "60px" }}
                >
                    <img src={order.prestation.image} alt="" />
                </div>
                <div className="flex flex-col flex-1">
                    <p className="text-xs" title={order.prestation.name}>
                        {order.prestation.name.length > 20
                            ? order.prestation.name.slice(0, 20) + "..."
                            : order.prestation.name}
                    </p>
                    <button className="text-xs cursor-default py-1 px-10 w-fit border border-primary border-1 rounded rounded-md text-primary mt-auto">
                        {order.status}
                    </button>
                </div>
            </div>
            <div className="divider my-0" />
            {order.status === "TERMINATED" && (
                <Button
                    visual="primary"
                    onClick={handleFinalization}
                    disabled={loading}
                >
                    {loading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Mark as completed
                </Button>
            )}
            {order.status === "TERMINATED" &&
                order.currentRevisionNb < order.serviceRevisionNb && (
                    <Button
                        visual="primary"
                        onClick={handleRevision}
                        disabled={loading}
                    >
                        {loading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Start revision
                    </Button>
                )}
            <Link
                className="w-full"
                to={
                    order.prestation.isActive
                        ? `/prestations/${order.prestation._id}`
                        : "#"
                }
            >
                <Button
                    disabled={!order.prestation.isActive}
                    visual="primary"
                    className={`w-full`}
                >
                    Order again
                </Button>
            </Link>
        </div>
    );
}
