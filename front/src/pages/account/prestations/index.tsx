import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button";
import ManagePrestationCard from "../../../components/prestation-card/manage-prestation-card";
import { PrestationItemList } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";

export default function Prestations() {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPrestations = async () => {
        try {
            setLoading(true);
            const res = await prestationService.getSelfPrestations();
            setPrestations(res);
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrestations();
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Prestations</h1>
                <Link
                    className="w-full md:w-auto"
                    to={"/account/prestations/create"}
                >
                    <Button className="w-full" visual="primary">
                        Create
                    </Button>
                </Link>
            </div>
            {prestations.length === 0 ? (
                <div>
                    <p>You have no prestation yet</p>
                </div>
            ) : (
                <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {prestations.map((p, index) => (
                        <ManagePrestationCard prestation={p} key={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
