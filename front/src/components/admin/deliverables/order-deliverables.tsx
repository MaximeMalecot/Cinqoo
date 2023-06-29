import { useCallback, useEffect, useState } from "react";
import { DeliverableI } from "../../../interfaces/deliverable";
import deliverableService from "../../../services/delivrable.service";
import { displayMsg } from "../../../utils/toast";
import Button from "../../button";

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
        <div className="flex flex-col">
            {deliverables.length > 0 ? (
                <div>
                    <div className="flex gap-1">
                        <h2 className="text-2xl">Delivrables</h2>
                    </div>
                    <div className="border-2 rounded rounded-md overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliverables.map((deliverable) => (
                                    <tr key={deliverable._id}>
                                        <td>{deliverable._id}</td>
                                        <td>{deliverable.name}</td>
                                        <td>{deliverable.link}</td>
                                        <td>
                                            <Button>
                                                <a
                                                    href={deliverable.link}
                                                    target="_blank"
                                                >
                                                    See
                                                </a>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>No deliverables</div>
            )}
        </div>
    );
}
