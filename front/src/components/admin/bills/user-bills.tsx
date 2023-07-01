import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-xl font-bold">Bills</h3>
            {bills.length === 0 && <p>This user has no bill</p>}
            {bills.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Service</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill, index) => (
                                <BillRowItem key={index} bill={bill} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function BillRowItem({ bill }: { bill: BillsItemList }) {
    return (
        <tr className="hover bg-slate-100">
            <td>{bill._id}</td>
            <td>
                <Link
                    to={`/admin/prestations/${bill.serviceId}`}
                    className="underline"
                >
                    {bill.serviceId}
                </Link>
            </td>
            <td>
                {bill.amount} ({bill.currency})
            </td>
            <td>{bill.status}</td>
            <td>{new Date(bill.createdAt).toLocaleString()}</td>
        </tr>
    );
}
