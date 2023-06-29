import { PrestationItemList } from "../../../interfaces/prestation";

interface PrestationItemProps {
    prestation: PrestationItemList;
}

export default function PrestationItem({ prestation }: PrestationItemProps) {
    return <div>Prestation item {JSON.stringify(prestation)}</div>;
}
