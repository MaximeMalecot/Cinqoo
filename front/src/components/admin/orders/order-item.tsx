import { Order } from "../../../interfaces/order";

interface OrderItemProps {
    order: Order;
}

export default function OrderItem({ order }: OrderItemProps) {
    return <div>Order item {JSON.stringify(order)}</div>;
}
