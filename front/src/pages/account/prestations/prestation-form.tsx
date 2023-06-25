import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { TextArea } from "../../../components/text-area";
import {
    CreatePrestationForm,
    PrestationItemList,
} from "../../../interfaces/prestation";
import { displayMsg } from "../../../utils/toast";

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
                    submitCb(data, image);
                }
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [image]
    );

    useEffect(() => {
        if (Array.isArray(errors) && errors.length > 0) {
            console.log(errors);
        }
    }, [errors]);

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
            <div className="w-full flex flex-col gap-5">
                <Button visual="primary" type="submit" className="flex-1">
                    {label ? label : "Apply"}
                </Button>
                <p className="text-center text-sm text-slate-500">
                    By creating your service you agree to the Cinqoo ToS
                </p>
            </div>
        </form>
    );
}
