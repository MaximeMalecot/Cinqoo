import { Link } from "react-router-dom";
import { Request } from "../../interfaces/request";

interface RequestItemProps {
    request: Request;
}

export default function RequestItem({ request }: RequestItemProps) {
    return (
        <div className="p-5 border border-1 border-slate-300 rounded-md flex flex-col gap-3">
            <p className="text-xl">
                Request no. <span className="font-bold">{request._id}</span>
            </p>
            <Link
                target="_blank"
                to={`/prestations/${request.prestation._id}`}
                className="text-primary underline font-bold"
            >
                {request.prestation.name}
            </Link>
            <p>{new Date(request.date).toLocaleString()}</p>
        </div>
    );
}
