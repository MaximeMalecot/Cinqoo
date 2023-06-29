import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BillsItemList } from "../../../interfaces/bill";
import billService from "../../../services/bill.service";
import { displayMsg } from "../../../utils/toast";

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
        <div className="w-full">
            <h3 className="text-xl font-bold">Bills</h3>
            {bills.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ordered by</th>
                                <th>Status</th>
                                <th>Currency</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <BillRowItem bill={bill} />
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
        <tr className="bg-base-200">
            <td>{bill._id}</td>
            <td>
                <Link className="underline" target="_blank" to={""}>
                    {bill.userId}
                </Link>
            </td>
            <td>{bill.status}</td>
            <td>{bill.currency}</td>
            <td>{bill.amount}</td>
            <td>{new Date(bill.createdAt).toLocaleString()}</td>
        </tr>
    );
}
