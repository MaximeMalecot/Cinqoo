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
                className="object-cover overflow-hidden rounded-md bg-slate-400"
                style={{ height: "100px", width: "100px" }}
            >
                <img
                    src={request.prestation.image}
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <p className="text-xl">
                        Request no.{" "}
                        <span className="font-bold">{request._id}</span>
                    </p>
                    <div className="badge badge-primary badge-outline">
                        {request.status}
                    </div>
                </div>
                <Link
                    target="_blank"
                    to={`/prestations/${request.prestation._id}`}
                    className="text-primary underline font-bold"
                >
                    {request.prestation.name}
                </Link>
                <p>{new Date(request.date).toLocaleString()}</p>
                <Link
                    className="block md:hidden ml-0 md:ml-auto"
                    to={`/account/requests/${request._id}`}
                >
                    <Button visual="primary">Manage</Button>
                </Link>
            </div>
            <Link
                className="hidden md:block ml-0 md:ml-auto"
                to={`/account/requests/${request._id}`}
            >
                <Button visual="primary">Manage</Button>
            </Link>
        </div>
    );
}
