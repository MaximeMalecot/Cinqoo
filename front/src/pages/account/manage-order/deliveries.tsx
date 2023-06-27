import { Order } from "../../../interfaces/order";

interface DeliveriesProps {
    order: Order;
}

export default function Deliveries({ order }: DeliveriesProps) {
    return (
        <section className="border border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full shadow-xl">
            <h1 className="font-bold text-xl">Deliveries</h1>
        </section>
    );
}
