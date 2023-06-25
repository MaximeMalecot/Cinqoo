import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { TextArea } from "../../../components/text-area";
import { CreatePrestationForm } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";

export default function CreatePrestation() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [imagePreview, setImagePreview] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

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

    const triggerFileInput = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        fileInputRef.current?.click();
    }, []);

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                if (!image) {
                    throw new Error("You must provide an image");
                }
                const res = await prestationService.createPrestation(
                    data as CreatePrestationForm,
                    image
                );
                if (res._id) {
                    displayMsg("Prestation created", "success");
                    navigate(`/account/prestations/${res._id}`);
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
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Create Prestation</h1>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 py-0"
            >
                <Input
                    placeholder="Name"
                    register={registerField("name", {
                        required: true,
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
                    <Button
                        visual="secondary"
                        onClick={triggerFileInput}
                        className="mt-5"
                    >
                        Upload a new one
                    </Button>
                </div>
                <TextArea
                    placeholder="Description"
                    register={registerField("description", {
                        required: true,
                    })}
                />
                <Input
                    placeholder="Number of revisions (default is 0)"
                    type="number"
                    min={0}
                    register={registerField("revisionNb", {
                        required: false,
                        min: 0,
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
                    })}
                />
                <div className="w-full flex flex-col gap-5">
                    <Button visual="primary" type="submit" className="flex-1">
                        Create
                    </Button>
                    <p className="text-center text-sm text-slate-500">
                        By creating your service you agree to the Cinqoo ToS
                    </p>
                </div>
            </form>
        </div>
    );
}
