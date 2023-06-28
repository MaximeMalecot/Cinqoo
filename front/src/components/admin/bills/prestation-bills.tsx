import { useEffect, useState } from "react";
import { BillsItemList } from "../../../interfaces/bill";
import billService from "../../../services/bill.service";
import { displayMsg } from "../../../utils/toast";
import BillItem from "./bill-item";

interface Props {
    prestationId: string;
}

export default function PrestationBills({ prestationId }: Props) {
    const [bills, setBills] = useState<BillsItemList[]>([]);

    const fetchOrders = async () => {
        try {
            const res = await billService.getBillsByPrestation(prestationId);
            console.log(res);
            setBills(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [prestationId]);

    return (
        <div>
            <h3 className="text-xl font-bold">Bills</h3>
            {bills.length > 0 &&
                bills.map((bill) => <BillItem key={bill._id} bill={bill} />)}
        </div>
    );
}
