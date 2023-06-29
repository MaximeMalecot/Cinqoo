import { useEffect, useState } from "react";
import { PrestationItemList } from "../../../interfaces/prestation";
import categoryService from "../../../services/category.service";
import { displayMsg } from "../../../utils/toast";
import PrestationItem from "./prestation-item";

interface CategoryPrestationProps {
    categoryId: string;
}

export default function CategoryPrestations({
    categoryId,
}: CategoryPrestationProps) {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);

    const fetchPrestationsByCategory = async () => {
        try {
            const res = await categoryService.getPrestationsByCategory(
                categoryId
            );
            setPrestations(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchPrestationsByCategory();
    }, [categoryId]);

    return (
        <div>
            <h3 className="text-xl font-bold">Prestations</h3>
            <h4 className="text-xl font-bold">Prestations by Category</h4>
            <div>
                {prestations.length > 0 &&
                    prestations.map((prestation) => (
                        <PrestationItem
                            key={prestation._id}
                            prestation={prestation}
                        />
                    ))}
            </div>
        </div>
    );
}
