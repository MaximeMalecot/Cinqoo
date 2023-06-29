import { useEffect, useState } from "react";
import { Order } from "../../../interfaces/order";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";
import OrderItem from "./order-item";

interface Props {
    userId: string;
}

export default function UserOrders({ userId }: Props) {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getOrdersByUser(userId);
            console.log(res);
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
        <div>
            <h3 className="text-xl font-bold">Orders</h3>
            {orders.length > 0 &&
                orders.map((order) => (
                    <OrderItem key={order._id} order={order} />
                ))}
        </div>
    );
}
