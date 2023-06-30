import { BillsItemList } from "../../../interfaces/bill";

interface BillItemProps {
    bill: BillsItemList;
}

export default function BillItem({ bill }: BillItemProps) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-1 justify-between">
                <h2 className="text-black text-2xl">
                    Bill no. <span className="font-bold">{bill._id}</span>
                </h2>
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

                    <p>
                        <span className="text-black font-bold">
                            Created at:
                        </span>
                        {` ${new Date(bill.createdAt).toLocaleString()}`}
                    </p>
                </div>
            </div>
        </div>
    );
}
