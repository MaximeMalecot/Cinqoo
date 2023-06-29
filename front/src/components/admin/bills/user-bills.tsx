import { useEffect, useState } from "react";
import { BillsItemList } from "../../../interfaces/bill";
import billService from "../../../services/bill.service";
import { displayMsg } from "../../../utils/toast";

interface Props {
    userId: string;
}

export default function UserBills({ userId }: Props) {
    const [bills, setBills] = useState<BillsItemList[]>([]);

    const fetchBills = async () => {
        try {
            const res = await billService.getBillsByUser(userId);
            console.log(res);
            setBills(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchBills();
    }, [userId]);

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold">Bills</h3>
            {bills.length === 0 && <p>This user has no bill</p>}
        </div>
    );
}
