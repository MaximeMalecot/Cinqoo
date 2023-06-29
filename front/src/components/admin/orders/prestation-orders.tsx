import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Order } from "../../../interfaces/order";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";
import Button from "../../button";

interface Props {
    prestationId: string;
}

export default function PrestationOrders({ prestationId }: Props) {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getOrdersByPrestation(prestationId);
            setOrders(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [prestationId]);

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold">Orders</h3>
            {orders.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ordered by</th>
                                <th>Revisions</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderRowItem order={order} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {orders.length === 0 && (
                <p className="text-center">No orders for this prestation</p>
            )}
        </div>
    );
}

function OrderRowItem({ order }: { order: Order }) {
    return (
        <tr className="bg-base-200">
            <td>{order._id}</td>
            <td>
                <Link
                    className="underline"
                    to={`/admin/users/${order.applicant}`}
                >
                    {order.applicant}
                </Link>
            </td>
            <td className="text-slate-500">
                <span className="text-black">serviceRevisionNb:</span>
                {order.serviceRevisionNb} |{" "}
                <span className="text-black">currentRevisionNb:</span>{" "}
                {order.currentRevisionNb}
            </td>
            <td>{order.status}</td>
            <td>{new Date(order.date).toLocaleString()}</td>
            <td>
                <Link to={`/admin/orders/${order._id}`}>
                    <Button>See</Button>
                </Link>
            </td>
        </tr>
    );
}
