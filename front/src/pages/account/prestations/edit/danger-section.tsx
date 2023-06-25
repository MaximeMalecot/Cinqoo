import Button from "../../../../components/button";
import { PrestationItemList } from "../../../../interfaces/prestation";

interface SectionProps {
    prestation: PrestationItemList;
}

export default function DangerSection({ prestation }: SectionProps) {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Danger Zone 🚨</h2>
            <Button visual="danger">Delete prestation</Button>
        </div>
    );
}
