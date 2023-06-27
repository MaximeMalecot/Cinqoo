import { DeliverableI } from "../../interfaces/deliverable";

interface DeliverableProps {
    deliverable: DeliverableI;
}

export default function Deliverable({ deliverable }: DeliverableProps) {
    return (
        <article className="flex flex-col border border-1 border-slate-300 p-3 rounded rounded-md">
            <h3 className="font-italic uppercase text-slate-400">
                Delivery #{deliverable._id} - Published on{" "}
                {new Date(deliverable!.createdAt as Date).toLocaleString()}
            </h3>
            <h2 className="text-xl"></h2>
            <p className="font-bold">File:</p>
            <a
                href={deliverable.link}
                target="_blank"
                className="text-bold text-primary text-xl underline w-fit"
            >
                {deliverable.name}
            </a>
        </article>
    );
}
