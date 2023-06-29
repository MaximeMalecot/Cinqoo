import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDeliverable from "../../components/admin/deliverables/order-deliverables";
import PrestationItem from "../../components/admin/prestations/prestation-item";
import { Order } from "../../interfaces/order";
import { PrestationItemList } from "../../interfaces/prestation";
import orderService from "../../services/order.service";
import { displayMsg } from "../../utils/toast";

export default function AdminOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();
    const [prestation, setPrestation] = useState<PrestationItemList>();

    const fetchOrder = useCallback(async () => {
        try {
            if (!id) throw new Error("No id provided");
            const { prestation, ...order } = await orderService.getOrder(id);
            setOrder(order);
            setPrestation(prestation);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, []);

    return (
        order && (
            <div>
                Order {JSON.stringify(order)}
                {prestation && <PrestationItem prestation={prestation} />}
                <OrderDeliverable orderId={order._id} />
            </div>
        )
    );
}
