import { useEffect, useState } from "react";
import ViewPrestationCard from "../../components/prestation/prestation-card/view-prestation-card";
import PrestationSearchForm from "../../components/prestation/prestation-search-form";
import {
    PrestationFilters,
    PrestationItemList,
} from "../../interfaces/prestation";
import prestationService from "../../services/prestation.service";
import { displayMsg } from "../../utils/toast";

export default function Prestations() {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);
    const [currentFilters, setCurrentFilters] = useState<PrestationFilters>({
        query: "",
        price_min: null,
        price_max: null,
        categories: [],
    });

    const fetchPrestations = async (data: PrestationFilters) => {
        try {
            const res = await prestationService.searchPrestations(data);
            setPrestations(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchPrestations(currentFilters);
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Prestations</h1>
                    <PrestationSearchForm
                        initData={currentFilters}
                        handleSearch={fetchPrestations}
                    />
                </div>
            </div>
            {prestations.length === 0 ? (
                <div>
                    <p>There is nothing... sorry :/</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5 items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {prestations.map((p, index) => (
                        <ViewPrestationCard prestation={p} key={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
