import { Link } from "react-router-dom";
import { BillsItemList } from "../../interfaces/bill";
import { Order } from "../../interfaces/order";
import Button from "../button";

interface OrderItemProps {
    order: Order;
    bill?: BillsItemList;
}

const invalidStatus = ["REFUSED", "CANCELLED"];

export default function OrderItem({ order, bill }: OrderItemProps) {
    return (
        <div className="p-5 border border-1 border-slate-300 rounded-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <p className="text-xl">
                        Order no. <span className="font-bold">{order._id}</span>
                    </p>
                    <div className="flex gap-5">
                        <div className={"flex gap-2 w-fit"}>
                            <p>Revisions available:</p>
                            <p>{order.serviceRevisionNb}</p>
                        </div>
                        <div className={"flex gap-2 w-fit"}>
                            <p>Current revision:</p>
                            <p>{order.currentRevisionNb}</p>
                        </div>
                    </div>
                    <p>{new Date(order.date).toLocaleString()}</p>
                </div>
                {!invalidStatus.includes(order.status) && (
                    <Link to={`/account/orders/${order._id}`}>
                        <Button visual="primary">Manage</Button>
                    </Link>
                )}
            </div>
            {bill && (
                <>
                    <div className="divider my-0"></div>
                    <div className="h-2/5 flex flex-col gap-3">
                        <p>
                            Bill no.{" "}
                            <span className="font-bold">{bill._id}</span>
                        </p>
                        <p className="border border-1 border-slate-400 w-fit px-2 rounded-md text-slate-400 cursor-pointer hover:bg-slate-400 hover:text-white">
                            {bill.status}
                        </p>
                        <p className="font-bold text-xl">
                            Total: {bill.amount} €
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
