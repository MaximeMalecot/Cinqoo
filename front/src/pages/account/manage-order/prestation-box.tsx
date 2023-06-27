import { Link } from "react-router-dom";
import Button from "../../../components/button";
import { Order } from "../../../interfaces/order";

interface OrderBoxProps {
    order: Order;
}

export default function PrestationBox({ order }: OrderBoxProps) {
    return (
        <div className="w-full h-fit border flex flex-col gap-5 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full shadow-xl">
            <h1 className="text-xl">Prestation details</h1>
            <div className="flex overflow-hidden gap-2">
                <div
                    className="object-contain rounded-md rounded overflow-hidden"
                    style={{ height: "60px", width: "60px" }}
                >
                    <img src={order.prestation.image} alt="" />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs" title={order.prestation.name}>
                        {order.prestation.name.length > 20
                            ? order.prestation.name.slice(0, 20) + "..."
                            : order.prestation.name}
                    </p>
                    <button className="cursor-default p-y-1 border border-primary border-1 rounded rounded-md text-primary mt-auto">
                        {order.status}
                    </button>
                </div>
            </div>
            <div className="divider my-0" />
            {order.status === "TERMINATED" && (
                <Button visual="primary">Mark as completed</Button>
            )}
            {order.status === "TERMINATED" &&
                order.currentRevisionNb <= order.serviceRevisionNb && (
                    <Button visual="primary">Mark as completed</Button>
                )}
            <Link
                className="w-full"
                to={`/prestations/${order.prestation._id}`}
            >
                <Button
                    disabled={!order.prestation.isActive}
                    visual="primary"
                    className="w-full"
                >
                    Order again
                </Button>
            </Link>
        </div>
    );
}
