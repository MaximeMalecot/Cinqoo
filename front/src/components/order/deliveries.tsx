import { useEffect, useState } from "react";
import { ORDER_STATUS } from "../../constants/status";
import { DeliverableI } from "../../interfaces/deliverable";
import { Order } from "../../interfaces/order";
import delivrableService from "../../services/delivrable.service";
import { displayMsg } from "../../utils/toast";
import Deliverable from "./deliverable";
import PublishDeliverable from "./publish-deliverable-form";

interface DeliveriesProps {
    order: Order;
    isFreelancer?: boolean;
}

export default function Deliveries({
    order,
    isFreelancer = false,
}: DeliveriesProps) {
    const [loading, setLoading] = useState(false);
    const [deliverables, setDeliverables] = useState<DeliverableI[]>([]);
    const canPublish = (() => {
        if (!isFreelancer) return false;
        return order.status === ORDER_STATUS.IN_PROGRESS;
    })();

    const getDeliverables = async () => {
        try {
            setLoading(true);
            const res = await delivrableService.getDeliverables(order._id);
            setDeliverables(res);
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const createDeliverable = async (data: any) => {
        const { name, file } = data;
        const res = await delivrableService.publishDeliverable(
            order._id,
            name,
            file
        );
        setDeliverables([...deliverables, res]);
    };

    useEffect(() => {
        getDeliverables();
    }, []);

    return (
        <section className="border border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full shadow-xl">
            <h1 className="font-bold text-xl">Deliveries</h1>
            {deliverables.length === 0 ? (
                <p>
                    {isFreelancer
                        ? "You haven't posted anything yet"
                        : "The freelancer hasn't posted anything yet"}
                </p>
            ) : (
                <div className="flex flex-col gap-5 py-5">
                    {deliverables.map((deliverable, index) => (
                        <Deliverable key={index} deliverable={deliverable} />
                    ))}
                </div>
            )}
            {canPublish && <PublishDeliverable publish={createDeliverable} />}
        </section>
    );
}
