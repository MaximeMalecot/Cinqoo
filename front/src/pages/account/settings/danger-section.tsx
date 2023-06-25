import Button from "../../../components/button";

export default function DangerSection() {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Danger Zone 🚨</h2>
            <Button visual="danger">Delete my account</Button>
        </div>
    );
}
