import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ViewPrestationCard from "../../components/prestation/prestation-card/view-prestation-card";
import PrestationSearchForm from "../../components/prestation/prestation-search-form";
import { Category } from "../../interfaces/category";
import {
    PrestationFilters,
    PrestationItemList,
} from "../../interfaces/prestation";
import categoryService from "../../services/category.service";
import prestationService from "../../services/prestation.service";
import { displayMsg } from "../../utils/toast";

export default function Prestations() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentFilters, setCurrentFilters] = useState<PrestationFilters>({
        query: searchParams.get("query") || "",
        price_min: null,
        price_max: null,
        categories: searchParams.get("categories") ?? "",
    });

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            setCategories(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const handleSubmit = async (data: PrestationFilters) => {
        setCurrentFilters(data);
        const queryFilters = Object.entries(data).reduce(
            (acc: any, [key, value]) => {
                if (value) {
                    acc[key] = value;
                }
                return acc;
            },
            {} as any
        );
        setSearchParams(queryFilters);
        fetchPrestations(data);
    };

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
        fetchCategories();
        fetchPrestations(currentFilters);
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Prestations</h1>
                    <PrestationSearchForm
                        initData={currentFilters}
                        handleSearch={handleSubmit}
                        categories={categories}
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
