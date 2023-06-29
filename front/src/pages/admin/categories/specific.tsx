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

    if (!category)
        return (
            <div className="flex flex-col">
                <div className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col gap-5">
                    Loading...
                </div>
            </div>
        );

    return (
        <div className="flex flex-col w-full overflow-hidden">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full flex flex-col gap-5">
                    <div className="flex gap-1">
                        <h1 className="text-4xl">{category.name}</h1>
                    </div>
                </div>
            </section>

            <CategoryPrestations categoryId={category?._id} />
        </div>
    );
}
