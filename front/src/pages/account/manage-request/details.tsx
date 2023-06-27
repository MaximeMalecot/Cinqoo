import { ORDER_STATUS } from "../../../constants/status";
import { Order } from "../../../interfaces/order";

interface DetailsProps {
    order: Order;
}

export default function Details({ order }: DetailsProps) {
    const step = (() => {
        switch (order.status) {
            case ORDER_STATUS.REFUSED:
                return 0;
            case ORDER_STATUS.IN_PROGRESS:
                return 1;
            case ORDER_STATUS.TERMINATED:
                return 2;
            case ORDER_STATUS.DONE:
                return 3;
            case ORDER_STATUS.CANCELLED:
                return 4;
            default:
                return 0;
        }
    })();

    return (
        <section className="border border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full shadow-xl">
            <h1 className="font-bold text-xl">{order.prestation.name}</h1>
            <p className="text-slate-400">
                Ordered on {new Date(order.date).toLocaleString()}
            </p>
            <ul className="steps w-full mt-5">
                <li className={`step step-primary`}>
                    {order.status === ORDER_STATUS.CANCELLED
                        ? "Cancelled"
                        : "Pending"}
                </li>
                <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
                    {order.status === ORDER_STATUS.REFUSED
                        ? "Refused"
                        : "In progress"}
                </li>
                <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
                    Terminated by you
                </li>
                <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
                    Marked as done by the client
                </li>
            </ul>
        </section>
    );
}
