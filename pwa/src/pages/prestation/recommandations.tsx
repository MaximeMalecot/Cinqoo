import { useEffect, useState } from "react";
import ViewPrestationCard from "../../components/prestation/prestation-card/view-prestation-card";
import { PrestationItemList } from "../../interfaces/prestation";
import prestationService from "../../services/prestation.service";

interface RecommandationsProps {
    prestationIdToExlude?: string | null;
}

export default function Recommandations({
    prestationIdToExlude = null,
}: RecommandationsProps) {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);
    const filteredPrestations = prestationIdToExlude
        ? prestations.filter((p) => p._id !== prestationIdToExlude)
        : prestations;

    const fetchRandomPrestations = async () => {
        try {
            const res = await prestationService.getRandomPrestations();
            setPrestations(res);
        } catch (e: any) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        fetchRandomPrestations();
    }, []);

    if (filteredPrestations.length === 0) return null;

    return (
        <section className="p-10 bg-slate-200">
            <div className="container mx-auto flex flex-col gap-5 relative">
                <h3 className="text-xl">You may also like:</h3>
                {filteredPrestations.length > 0 && (
                    <div className="flex flex-col gap-5 items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredPrestations.slice(0, 4).map((p, index) => (
                            <ViewPrestationCard prestation={p} key={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
