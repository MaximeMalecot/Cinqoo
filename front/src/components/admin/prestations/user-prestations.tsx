import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PrestationItemList } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";
import Button from "../../button";

interface UserPrestationsProps {
    userId: string;
}

export default function UserPrestations({ userId }: UserPrestationsProps) {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);

    const fetchPrestationsByUser = async () => {
        try {
            const res = await prestationService.getUserPrestations(userId);
            console.log(res);
            setPrestations(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchPrestationsByUser();
    }, [userId]);

    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-xl font-bold">Prestations</h3>
            {prestations.length === 0 && <p>This user has no prestation</p>}
            {prestations.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Revisions</th>
                                <th>Created at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prestations.map((prestation, index) => (
                                <PrestationRowItem
                                    key={index}
                                    prestation={prestation}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function PrestationRowItem({ prestation }: { prestation: PrestationItemList }) {
    return (
        <tr className="hover bg-slate-100">
            <td>
                <figure style={{ width: "80px", height: "80px" }} className="">
                    <img
                        src={prestation.image}
                        className="object-cover w-full h-full"
                        alt="Prestation image"
                    />
                </figure>
            </td>
            <td>{prestation.name}</td>
            <td>{prestation.revisionNb}</td>
            <td>{new Date(prestation.createdAt).toLocaleString()}</td>
            <td>
                <Link to={`/admin/prestations/${prestation._id}`}>
                    <Button>See</Button>
                </Link>
            </td>
        </tr>
    );
}
