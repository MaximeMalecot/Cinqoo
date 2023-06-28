import { useEffect, useState } from "react";
import { Order } from "../../../interfaces/order";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";
import OrderItem from "./order-item";

interface Props {
    prestationId: string;
}

export default function PrestationOrders({ prestationId }: Props) {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await orderService.getOrdersByPrestation(prestationId);
            console.log(res);
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
        <div>
            <h3 className="text-xl font-bold">Orders</h3>
            {orders.length > 0 &&
                orders.map((order) => (
                    <OrderItem key={order._id} order={order} />
                ))}
        </div>
    );
}
