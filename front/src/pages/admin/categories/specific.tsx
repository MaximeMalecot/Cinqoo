import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Category } from "../../../interfaces/category";
import { PrestationItemList } from "../../../interfaces/prestation";
import categoryService from "../../../services/category.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminCategory() {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);

    const fetchCategory = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await categoryService.getCategory(id);
            setCategory(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const fetchPrestations = useCallback(async () => {
        try {
            if (!category) return;
            const res = await categoryService.getPrestationsByCategory(
                category._id
            );
            setPrestations(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [category]);

    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        fetchPrestations();
        console.log(category, prestations);
    }, [category]);

    return <div>Category {category && category.name}</div>;
}
