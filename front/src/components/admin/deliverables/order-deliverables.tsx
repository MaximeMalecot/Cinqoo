import { useCallback, useEffect, useState } from "react";
import { DeliverableI } from "../../../interfaces/deliverable";
import deliverableService from "../../../services/delivrable.service";
import { displayMsg } from "../../../utils/toast";

interface OrderDeliverableProps {
    orderId: string;
}

export default function OrderDeliverable({ orderId }: OrderDeliverableProps) {
    const [deliverables, setDeliverables] = useState<DeliverableI[]>([]);

    const fetchDeliverables = useCallback(async () => {
        try {
            const res = await deliverableService.getDeliverables(orderId);
            setDeliverables(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, [orderId]);

    useEffect(() => {
        fetchDeliverables();
    }, [orderId]);

    return (
        <div>
            {deliverables.length > 0 && (
                <>
                    Delivrables
                    {deliverables.map((deliverable) => (
                        <div key={deliverable._id}>
                            {JSON.stringify(deliverable)}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
