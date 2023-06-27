import { DeliverableI } from "../../interfaces/deliverable";

interface DeliverableProps {
    deliverable: DeliverableI;
}

export default function Deliverable({ deliverable }: DeliverableProps) {
    return (
        <div>
            <p>{deliverable.name}</p>
            <a href={deliverable.file} target="_blank" rel="noreferrer">
                Download
            </a>
        </div>
    );
}
