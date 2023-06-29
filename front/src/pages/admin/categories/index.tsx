import { useEffect, useState } from "react";
import { Category } from "../../../interfaces/category";
import categoryService from "../../../services/category.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            setCategories(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        console.log("OHFRERO");
        fetchCategories();
    }, []);

    return <div>Categories {JSON.stringify(categories)}</div>;
}
