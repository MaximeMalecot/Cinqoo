import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PrestationItemList } from "../../../../interfaces/prestation";
import prestationService from "../../../../services/prestation.service";
import { displayMsg } from "../../../../utils/toast";
import DangerSection from "./danger-section";
import EditSection from "./edit-section";
import VisibilitySection from "./visibility-section";

export default function EditPrestation() {
    const [prestation, setPrestation] = useState<PrestationItemList | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchPrestation = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const res = await prestationService.getPrestation(id);
            setPrestation(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg("This prestation does not exist", "error");
            navigate("/account/prestations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchPrestation(id);
        }
    }, [id]);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <p>Account</p>
                    </li>
                    <li>
                        <Link to="/account/prestations">Prestations</Link>
                    </li>
                    <li>{id}</li>
                </ul>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Edit Prestation</h1>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <VisibilitySection
                        reload={() => fetchPrestation(id!)}
                        prestation={prestation!}
                    />
                    <div className="divider py-0"></div>
                    <EditSection
                        prestation={prestation!}
                        refetch={() => fetchPrestation(id!)}
                    />
                    <div className="divider py-0"></div>
                    <DangerSection prestation={prestation!} />
                </>
            )}
        </div>
    );
}
