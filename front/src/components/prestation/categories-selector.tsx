import { useCallback, useEffect, useState } from "react";
import { Category } from "../../interfaces/category";
import Button from "../button";

interface CategoriesSelectorProps {
    categories: Category[];
    selectedCategories: string[];
    addCategory: (id: string) => void;
    removeCategory: (id: string) => void;
}

export default function CategoriesSelector({
    categories,
    selectedCategories,
    addCategory,
    removeCategory,
}: CategoriesSelectorProps) {
    const [currentSelected, setCurrentSelected] = useState<string | null>(null);
    const getCategoryName = useCallback(
        (id: string) => {
            const category = categories.find((c) => c._id === id);
            return category ? category.name : id;
        },
        [categories]
    );

    const handleAddCategory = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!currentSelected) return;
        addCategory(currentSelected);
        setCurrentSelected(null);
    };

    useEffect(() => {
        if (currentSelected === null && categories.length > 0) {
            setCurrentSelected(categories[0]._id);
        }
    }, [categories]);

    return (
        <div className="border border-md border-slate-300 rounded-md p-2 flex flex-col gap-2">
            <h3>Categories</h3>
            <div className="w-full flex">
                <select
                    onChange={(e) => setCurrentSelected(e.target.value)}
                    className="flex-1 border border-1 border-slate-300 !outline-none p-2 rounded-md capitalize"
                >
                    {categories.length === 0 ? (
                        <option disabled>No category available</option>
                    ) : (
                        categories.map((r, index) => (
                            <option key={index} value={r._id}>
                                {r.name}
                            </option>
                        ))
                    )}
                </select>
                <Button
                    visual="secondary"
                    className="ml-2"
                    onClick={handleAddCategory}
                >
                    Add
                </Button>
            </div>
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap">
                    {selectedCategories.map((c, index) => (
                        <Button
                            type="button"
                            key={index}
                            visual="secondary"
                            className="mr-2"
                            onClick={() => removeCategory(c)}
                        >
                            {getCategoryName(c)}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
