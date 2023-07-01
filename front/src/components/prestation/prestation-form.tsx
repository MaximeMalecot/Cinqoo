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
    const { register: registerField, handleSubmit } = useForm();
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
            <div className="w-full flex flex-col gap-2">
                <Input
                    placeholder="Price (€)"
                    className="w-full"
                    type="number"
                    min={1}
                    step={0.01}
                    register={registerField("price", {
                        required: true,
                        min: 1,
                        value: initData?.price,
                    })}
                />
                <div className="flex items-center gap-3 text-xs text-slate-500 italic">
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 216 216"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M88 64C88 60.8355 88.9384 57.7421 90.6965 55.1109C92.4546 52.4797 94.9535 50.4289 97.8771 49.2179C100.801 48.0069 104.018 47.6901 107.121 48.3074C110.225 48.9248 113.076 50.4487 115.314 52.6863C117.551 54.9239 119.075 57.7749 119.693 60.8786C120.31 63.9823 119.993 67.1993 118.782 70.1229C117.571 73.0466 115.52 75.5454 112.889 77.3035C110.258 79.0616 107.165 80 104 80C99.7566 80 95.6869 78.3143 92.6863 75.3137C89.6858 72.3131 88 68.2435 88 64ZM216 108C216 129.36 209.666 150.241 197.799 168.002C185.932 185.762 169.064 199.605 149.33 207.779C129.595 215.953 107.88 218.092 86.9303 213.925C65.9803 209.758 46.7366 199.472 31.6325 184.368C16.5284 169.263 6.24244 150.02 2.07524 129.07C-2.09197 108.12 0.0467949 86.4046 8.22106 66.6702C16.3953 46.9358 30.238 30.0685 47.9985 18.2013C65.759 6.33409 86.6397 0 108 0C136.634 0.0317622 164.085 11.4205 184.333 31.6675C204.58 51.9146 215.968 79.3664 216 108ZM192 108C192 91.3864 187.074 75.1458 177.843 61.3321C168.613 47.5184 155.494 36.7519 140.145 30.3941C124.796 24.0364 107.907 22.3729 91.6125 25.614C75.3181 28.8552 60.3507 36.8554 48.6031 48.603C36.8555 60.3506 28.8552 75.318 25.6141 91.6124C22.3729 107.907 24.0364 124.796 30.3942 140.145C36.7519 155.494 47.5184 168.613 61.3321 177.843C75.1459 187.073 91.3864 192 108 192C130.271 191.976 151.623 183.119 167.371 167.371C183.119 151.623 191.976 130.271 192 108ZM120 144.68V112C120 106.696 117.893 101.609 114.142 97.8579C110.391 94.1071 105.304 92 100 92C97.1661 91.9958 94.4222 92.9946 92.2542 94.8197C90.0861 96.6447 88.634 99.1782 88.1549 101.971C87.6758 104.764 88.2007 107.637 89.6366 110.08C91.0725 112.523 93.3267 114.38 96 115.32V148C96 153.304 98.1072 158.391 101.858 162.142C105.609 165.893 110.696 168 116 168C118.834 168.004 121.578 167.005 123.746 165.18C125.914 163.355 127.366 160.822 127.845 158.029C128.324 155.236 127.799 152.363 126.364 149.92C124.928 147.477 122.673 145.62 120 144.68Z"
                            fill="black"
                        />
                    </svg>

                    <p>
                        Do not forget Cinqoo takes a 20% commission fee on each
                        selling you do, so maybe adapt your prices with that in
                        mind.
                    </p>
                </div>
            </div>
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
