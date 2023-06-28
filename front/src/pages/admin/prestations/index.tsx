import { useEffect, useState } from "react";
import ViewPrestationCard from "../../../components/prestation/prestation-card/view-prestation-card";
import { PrestationItemList } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminPrestations() {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);

    const fetchPrestations = async () => {
        try {
            const res = await prestationService.adminGetPrestations();
            setPrestations(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchPrestations();
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Prestations</h1>
                </div>
            </div>
            {prestations.length === 0 ? (
                <div>
                    <p>There is nothing... sorry :/</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5 items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {prestations.map((p, index) => (
                        <ViewPrestationCard
                            adminRoute={true}
                            prestation={p}
                            key={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
