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
        <div className="w-full">
            <h3 className="text-xl font-bold">Prestations</h3>
            {prestations.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prestations.map((prestation) => (
                                <PrestationItem prestation={prestation} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
