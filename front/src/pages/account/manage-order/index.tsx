import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderConversation from "../../../components/messaging/order-conversation";
import Deliveries from "../../../components/order/deliveries";
import { Order } from "../../../interfaces/order";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";
import Details from "./details";
import PrestationBox from "./prestation-box";

export default function ManageOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const fetchOrder = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await orderService.getOrder(id);
            setOrder(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
            navigate("/account/orders");
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <p>Account</p>
                    </li>
                    <li>
                        <Link to="/account/orders">Orders</Link>
                    </li>
                    <li>Order #{id}</li>
                </ul>
            </div>
            {order && (
                <div className="flex flex-col md:flex-row gap-5 relative">
                    <div className="w-full flex flex-col gap-5">
                        <div className="tabs border border-slate-300 border-b-1 border-t-0 border-x-0">
                            <p
                                className={`text-xl tab ${
                                    activeTab === 0
                                        ? "tab-active text-primary"
                                        : ""
                                }`}
                                onClick={() => setActiveTab(0)}
                            >
                                Details
                            </p>
                            <p
                                className={`text-xl tab ${
                                    activeTab === 1
                                        ? "tab-active text-primary"
                                        : ""
                                }`}
                                onClick={() => setActiveTab(1)}
                            >
                                Deliveries
                            </p>
                            <p
                                className={`text-xl tab ${
                                    activeTab === 2
                                        ? "tab-active text-primary"
                                        : ""
                                }`}
                                onClick={() => setActiveTab(2)}
                            >
                                Messages
                            </p>
                        </div>
                        <div
                            style={{
                                display: activeTab === 0 ? "block" : "none",
                            }}
                        >
                            <Details reload={fetchOrder} order={order} />
                        </div>
                        <div
                            style={{
                                display: activeTab === 1 ? "block" : "none",
                            }}
                        >
                            <Deliveries order={order} />{" "}
                        </div>
                        {activeTab === 2 && <OrderConversation order={order} />}
                    </div>
                    <div className="w-full md:w-1/3 h-fit flex flex-col gap-5">
                        <PrestationBox reload={fetchOrder} order={order} />
                    </div>
                </div>
            )}
        </div>
    );
}
