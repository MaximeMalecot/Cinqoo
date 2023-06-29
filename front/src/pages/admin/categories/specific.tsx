import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryPrestations from "../../../components/admin/prestations/category-prestations";
import { Category } from "../../../interfaces/category";
import categoryService from "../../../services/category.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminCategory() {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const fetchCategory = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await categoryService.getCategory(id);
            setCategory(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    if (!category) return <div>Loading...</div>;

    return (
        <div>
            Category {category && category.name}
            <CategoryPrestations categoryId={category?._id} />
        </div>
    );
}
