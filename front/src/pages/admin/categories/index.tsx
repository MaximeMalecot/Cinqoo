import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { Category } from "../../../interfaces/category";
import categoryService from "../../../services/category.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

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

    return (
        <div className="overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl">Categories</h1>
                <Button onClick={() => navigate("/admin/categories/create")}>
                    Create
                </Button>
            </div>
            <div className="border-2 rounded rounded-md overflow-hidden">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <tr className="bg-base-200">
                                    <td>{category._id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/categories/${category._id}`
                                                )
                                            }
                                        >
                                            See
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
