import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BillItem from "../../components/admin/bills/bill-item";
import OrderDeliverable from "../../components/admin/deliverables/order-deliverables";
import PrestionOrder from "../../components/admin/prestations/order-prestation";
import Button from "../../components/button";
import { BillStatus, BillsItemList } from "../../interfaces/bill";
import { Order, OrderStatusEnum } from "../../interfaces/order";
import { PrestationItemList } from "../../interfaces/prestation";
import billService from "../../services/bill.service";
import orderService from "../../services/order.service";
import { displayMsg } from "../../utils/toast";

export default function AdminOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();
    const [bill, setBill] = useState<BillsItemList>();
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

    const fetchBill = useCallback(async () => {
        try {
            if (!order) return;
            const bill = await billService.getBill(order?.billId);
            setBill(bill);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [order]);

    const changeStatus = useCallback(
        async (e: React.ChangeEvent<HTMLSelectElement>) => {
            try {
                if (!id) throw new Error("No id provided");
                const status = e.target.value as OrderStatusEnum;
                await orderService.updateOrderStatus(id, status);
                displayMsg("Status updated", "success");
                fetchOrder();
            } catch (e: any) {
                displayMsg(e.message, "error");
            }
        },
        [id, order]
    );

    const refundOrder = useCallback(async () => {
        try {
            if (!bill) throw new Error("No bill provided");
            await billService.refundBill(bill._id);
            displayMsg("Order refunded", "success");
            fetchOrder();
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [bill]);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    useEffect(() => {
        fetchBill();
    }, [order]);

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
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className={"flex gap-2 w-fit"}>
                                <p>
                                    <span className="text-black font-bold">
                                        Revisions available:
                                    </span>
                                    {` ${order.serviceRevisionNb}`}
                                </p>
                            </div>
                            <div className={"flex gap-2 w-fit"}>
                                <p>
                                    <span className="text-black font-bold">
                                        Current revision:
                                    </span>
                                    {` ${order.currentRevisionNb}`}
                                </p>
                            </div>
                            <p>
                                <span className="text-black font-bold">
                                    Created at:
                                </span>
                                {` ${new Date(order.date).toLocaleString()}`}
                            </p>
                        </div>
                        {bill && (
                            <>
                                <BillItem bill={bill} />
                            </>
                        )}
                    </div>
                    {prestation && (
                        <>
                            <div className="divider my-0"></div>
                            <PrestionOrder prestation={prestation} />
                        </>
                    )}
                    <div className="divider my-0"></div>
                    <OrderDeliverable orderId={order._id} />
                    <div className="divider my-0"></div>

                    {bill && bill.status === BillStatus.PAID && (
                        <div className="flex flex-col gap-5">
                            <h2 className="text-xl">Danger Zone 🚨</h2>
                            <Button visual="danger" onClick={refundOrder}>
                                Refund client
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
