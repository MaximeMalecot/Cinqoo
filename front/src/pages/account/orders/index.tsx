import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button";
import { BillsItemList } from "../../../interfaces/bill";
import { Order } from "../../../interfaces/order";
import billService from "../../../services/bill.service";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";

const invalidStatus = ["REFUSED", "CANCELLED"];

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [bills, setBills] = useState<BillsItemList[]>([]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await orderService.getOrders();
            setOrders(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    const fetchBills = useCallback(async () => {
        try {
            const res = await billService.getBills();
            setBills(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchOrders(), fetchBills()]);
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Orders history</h1>
                </div>
                {orders.length === 0 ? (
                    <p>You have no order</p>
                ) : (
                    <>
                        {/* <div className="flex flex-col gap-2">
                            {orders.map((o, idx) => (
                                <OrderItem
                                    key={idx}
                                    order={o}
                                    bill={bills.find((b) => b._id === o.billId)}
                                />
                            ))}
                        </div> */}
                        <div className="overflow-x-auto border border-1 border-slate-300 rounded rounded-md">
                            <table className="table">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Order #</th>
                                        <th>Name</th>
                                        <th>Revisions</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o, idx) => (
                                        <tr
                                            key={idx}
                                            className={`hover ${
                                                idx % 2 === 0
                                                    ? "bg-slate-100"
                                                    : "bg-slate-200"
                                            }`}
                                        >
                                            <td>
                                                <div>
                                                    <img
                                                        src={o.prestation.image}
                                                        alt=""
                                                        className="w-20 h-20 rounded-md bg-slate-300 object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <th>{o._id}</th>
                                            <td>{o.prestation.name}</td>
                                            <td>
                                                Revisions available:{" "}
                                                {o.serviceRevisionNb} | Current
                                                revision: {o.currentRevisionNb}
                                            </td>
                                            <td>
                                                {new Date(
                                                    o.date
                                                ).toLocaleString()}
                                            </td>
                                            <td>{o.status}</td>
                                            <td>
                                                {!invalidStatus.includes(
                                                    o.status
                                                ) && (
                                                    <Link
                                                        to={`/account/orders/${o._id}`}
                                                    >
                                                        <Button visual="primary">
                                                            Manage
                                                        </Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
