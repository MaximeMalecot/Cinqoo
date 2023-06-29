import { useEffect, useState } from "react";
import { PrestationItemList } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";

interface UserPrestationsProps {
    userId: string;
}

export default function UserPrestations({ userId }: UserPrestationsProps) {
    const [prestationsByUser, setPrestationsByUser] = useState<
        PrestationItemList[]
    >([]);

    const fetchPrestationsByUser = async () => {
        try {
            const res = await prestationService.getUserPrestations(userId);
            console.log(res);
            setPrestationsByUser(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchPrestationsByUser();
    }, [userId]);

    return (
        <div>
            <h3 className="text-xl font-bold">Prestations</h3>
            <h4 className="text-xl font-bold">Prestations by User</h4>
            <div>{JSON.stringify(prestationsByUser)}</div>
        </div>
    );
}
