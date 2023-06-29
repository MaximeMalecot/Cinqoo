import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDeliverable from "../../components/admin/deliverables/order-deliverables";
import PrestionOrder from "../../components/admin/prestations/order-prestation";
import Button from "../../components/button";
import { Order, OrderStatusEnum } from "../../interfaces/order";
import { PrestationItemList } from "../../interfaces/prestation";
import orderService from "../../services/order.service";
import { displayMsg } from "../../utils/toast";

export default function AdminOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();
    const [prestation, setPrestation] = useState<PrestationItemList>();

    const fetchOrder = useCallback(async () => {
        try {
            if (!id) throw new Error("No id provided");
            const { prestation, ...order } = await orderService.getOrder(id);
            setOrder(order);
            setPrestation(prestation);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [id]);

    const changeStatus = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            try {
                if (!id) throw new Error("No id provided");
                const status = e.target.value as OrderStatusEnum;
                await orderService.updateOrderStatus(id, status);
                // fetchOrder();
            } catch (e: any) {
                displayMsg(e.message, "error");
            }
        },
        [id, order]
    );

    const refundOrder = useCallback(async () => {
        try {
            if (!id) throw new Error("No id provided");
            await orderService.refundOrder(id);
            // fetchOrder();
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, []);

    if (!order)
        return (
            <div className="flex flex-col">
                <div className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col gap-5">
                    Loading...
                </div>
            </div>
        );

    return (
        <div className="flex flex-col w-full overflow-hidden">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between w-full">
                            <h1 className="text-4xl">
                                Order no.{" "}
                                <span className="font-bold">{order._id}</span>
                            </h1>
                            <div>
                                <select
                                    className="select select-bordered "
                                    defaultValue={order.status}
                                    onChange={changeStatus}
                                >
                                    {Object.values(OrderStatusEnum).map(
                                        (status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        )
                                    )}
                                </select>
                                <Button onClick={refundOrder}>Refund</Button>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className={"flex gap-2 w-fit"}>
                                <p>Revisions available:</p>
                                <p>{order.serviceRevisionNb}</p>
                            </div>
                            <div className={"flex gap-2 w-fit"}>
                                <p>Current revision:</p>
                                <p>{order.currentRevisionNb}</p>
                            </div>
                        </div>
                        <p>{new Date(order.date).toLocaleString()}</p>
                    </div>
                    {prestation && <PrestionOrder prestation={prestation} />}
                    <OrderDeliverable orderId={order._id} />
                </div>
            </section>
        </div>
    );
}
