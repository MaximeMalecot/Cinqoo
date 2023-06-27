import { Link } from "react-router-dom";
import { ORDER_STATUS } from "../../constants/status";
import { Request } from "../../interfaces/request";
import Button from "../button";

interface RequestItemProps {
    request: Request;
}

export default function RequestItem({ request }: RequestItemProps) {
    return (
        <div
            className={`p-5 border border-1 border-slate-300 rounded-md flex gap-3 items-center ${
                request.status === ORDER_STATUS.DONE ? "bg-slate-200" : ""
            }`}
        >
            <div
                className="object-cover overflow-hidden rounded-md"
                style={{ height: "100px", width: "100px" }}
            >
                <img src={request.prestation.image} alt="" />
            </div>
            <div className="flex flex-col gap-3">
                <p className="text-xl">
                    Request no. <span className="font-bold">{request._id}</span>
                    <div className="badge badge-primary badge-outline ml-3">
                        {request.status}
                    </div>
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
            <Link className="ml-auto" to={`/account/requests/${request._id}`}>
                <Button visual="primary">Manage</Button>
            </Link>
        </div>
    );
}
