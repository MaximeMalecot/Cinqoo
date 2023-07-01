import { Link } from "react-router-dom";
import { PrestationItemList } from "../../../interfaces/prestation";
import Button from "../../button";

interface PrestationItemProps {
    prestation: PrestationItemList;
}

export default function PrestationItem({ prestation }: PrestationItemProps) {
    return (
        <tr className="bg-base-200">
            <td>
                <Link
                    className="underline"
                    to={`/admin/prestations/${prestation._id}`}
                >
                    {prestation._id}
                </Link>
            </td>
            <td>
                <img
                    className="w-10 h-10 object-cover rounded-full"
                    src={prestation.image}
                    alt={prestation.name}
                />
            </td>
            <td className="text-slate-500">
                <span className="text-black">{prestation.name}</span>
            </td>
            <td>{prestation.price}</td>
            <td>
                <Link
                    className="underline"
                    to={`/admin/users/${prestation.owner}`}
                >
                    {prestation.owner}
                </Link>
            </td>
            <td>
                <Link to={`/admin/prestations/${prestation._id}`}>
                    <Button>See</Button>
                </Link>
            </td>
        </tr>
    );
}
