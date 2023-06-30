import { BillsItemList } from "../../../interfaces/bill";

interface BillItemProps {
    bill: BillsItemList;
}

export default function BillItem({ bill }: BillItemProps) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-1 justify-between">
                <h2 className="text-black text-2xl">Bill no.{bill._id}</h2>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex gap-5">
                    <p>
                        <span className="text-black font-bold">Amount:</span>{" "}
                        {bill.amount} {bill.currency}
                    </p>

                    <p>
                        <span className="text-black font-bold">
                            Payment status:
                        </span>{" "}
                        {bill.status}
                    </p>

                    <td>{new Date(bill.createdAt).toLocaleString()}</td>
                </div>
            </div>
        </div>
    );
}
