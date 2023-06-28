import { BillsItemList } from "../../../interfaces/bill";

interface BillItemProps {
    bill: BillsItemList;
}

export default function BillItem({ bill }: BillItemProps) {
    return <div>Bill item {JSON.stringify(bill)}</div>;
}
