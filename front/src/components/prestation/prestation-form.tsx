import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Category } from "../../interfaces/category";
import {
    CreatePrestationForm,
    PrestationItemList,
} from "../../interfaces/prestation";
import categoryService from "../../services/category.service";
import { displayMsg } from "../../utils/toast";
import Button from "../button";
import { Input } from "../input";
import { TextArea } from "../text-area";
import CategoriesSelector from "./categories-selector";

interface PrestationFormProps {
    initData?: PrestationItemList | null;
    submitCb?: (data: CreatePrestationForm, image?: File | null) => void;
    label?: string;
}
export default function PrestationForm({
    initData,
    submitCb,
    label,
}: PrestationFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [imagePreview, setImagePreview] = useState<string>(
        initData?.image || ""
    );
    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initData?.categories ? initData.categories.map((c: any) => c!._id) : []
    );

    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryService.getCategories();
            setCategories(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    const addCategory = useCallback(
        (id: string) => {
            if (selectedCategories.includes(id)) return;
            setSelectedCategories((prev) => [...prev, id]);
            console.log("adding ", id);
        },
        [selectedCategories]
    );

    const removeCategory = useCallback(
        (id: string) => {
            setSelectedCategories((prev) =>
                prev.filter((categoryId) => categoryId !== id)
            );
        },
        [selectedCategories]
    );

    const handleFileChange = useCallback(
        (e: any) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type !== "image/png" && file.type !== "image/jpeg") {
                    displayMsg("You must provide a valid image", "error");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target?.result as string);
                };
                setImage(file);
                reader.readAsDataURL(file);
            }
        },
        [image]
    );

    const triggerFileInput = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        fileInputRef.current?.click();
    }, []);

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                if (submitCb) {
                    if (selectedCategories.length > 0) {
                        data.categories = selectedCategories;
                    }
                    submitCb(data, image);
                }
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [image, selectedCategories]
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 py-0"
        >
            <Input
                placeholder="Name"
                register={registerField("name", {
                    required: true,
                    value: initData?.name,
                })}
            />
            <div>
                <div
                    className="border border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full"
                    style={{
                        maxHeight: "440px",
                        height: imagePreview ? "440px" : "auto",
                    }}
                >
                    <img
                        src={imagePreview}
                        alt="Your prestation image"
                        className="object-contain w-full h-full"
                    />
                </div>
                <input
                    type="file"
                    className="hidden"
                    id="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div className="flex flex-col w-fit">
                    <Button
                        visual="secondary"
                        onClick={triggerFileInput}
                        className="mt-5"
                    >
                        Upload a new one
                    </Button>
                    <p className="text-sm text-slate-500 italic">
                        {image ? image.name : "None provided"}
                    </p>
                </div>
            </div>
            <TextArea
                placeholder="Description"
                register={registerField("description", {
                    required: true,
                    value: initData?.description,
                })}
            />
            <Input
                placeholder="Number of revisions (default is 0)"
                type="number"
                min={0}
                register={registerField("revisionNb", {
                    required: false,
                    min: 0,
                    value: initData?.revisionNb,
                })}
            />
            <Input
                placeholder="Price"
                type="number"
                min={1}
                step={0.01}
                register={registerField("price", {
                    required: true,
                    min: 1,
                    value: initData?.price,
                })}
            />
            <Input
                placeholder="Delay (in days)"
                type="number"
                min={1}
                step={1}
                register={registerField("delay", {
                    required: true,
                    min: 1,
                    value: initData?.delay,
                })}
            />
            <CategoriesSelector
                categories={categories}
                addCategory={addCategory}
                removeCategory={removeCategory}
                selectedCategories={selectedCategories}
            />
            <div className="w-full flex flex-col gap-5">
                <Button visual="primary" type="submit" className="flex-1">
                    {label ? label : "Apply"}
                </Button>
                <p className="text-center text-sm text-slate-500">
                    By creating or updating your service you agree to the Cinqoo
                    ToS
                </p>
            </div>
        </form>
    );
}
