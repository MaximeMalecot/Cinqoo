import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Order } from "../../../interfaces/order";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";
import Button from "../../button";

interface Props {
    userId: string;
}

export default function UserOrders({ userId }: Props) {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getOrdersByUser(userId);
            setOrders(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [userId]);

    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-xl font-bold">Orders</h3>
            {orders.length === 0 && <p>There is no order for this user</p>}
            {orders.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Order#</th>
                                <th>Name</th>
                                <th>Revisions</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <OrderRowItem key={index} order={order} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function OrderRowItem({ order }: { order: Order }) {
    return (
        <tr className="hover bg-slate-100">
            <td>
                <figure
                    style={{ width: "80px", height: "80px" }}
                    className="rounded-md overflow-hidden"
                >
                    <img
                        src={order.prestation.image}
                        className="object-cover w-full h-full"
                        alt="Prestation image"
                    />
                </figure>
            </td>
            <td>{order._id}</td>
            <td>{order.prestation.name}</td>
            <td>
                Revisions available: {order.serviceRevisionNb} | Current
                revision: {order.currentRevisionNb}
            </td>
            <td>{new Date(order.date).toLocaleString()}</td>
            <td>{order.status}</td>
            <td>
                <Link to={`/admin/orders/${order._id}`}>
                    <Button>See</Button>
                </Link>
            </td>
        </tr>
    );
}
