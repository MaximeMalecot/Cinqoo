import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SpecificOrder } from "../../../interfaces/order";
import orderService from "../../../services/order.service";
import { displayMsg } from "../../../utils/toast";

export default function ManageOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<SpecificOrder | null>(null);

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
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Manage order</h1>
            </div>
        </div>
    );
}
