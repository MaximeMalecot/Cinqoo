import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import categoryService from "../../../services/category.service";
import { displayMsg } from "../../../utils/toast";

export default function CreateCategory() {
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = useCallback(async (data: any) => {
        try {
            await categoryService.createCategory(data);
            displayMsg("Category created succesfully", "success");
            setTimeout(() => {
                navigate(`/admin/categories`);
            }, 2000);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, []);

    return (
        <div className="overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <h1 className="text-2xl">Create category</h1>
            <form
                className="flex flex-col gap-5 py-0 overflow-hidden rounded round-xl w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    type="text"
                    placeholder="Name"
                    register={registerField("name", {
                        required: true,
                    })}
                />
                {errors.name && (
                    <span className="text-xs text-red-500">
                        This field is required
                    </span>
                )}
                <Input
                    type="text"
                    placeholder="Description"
                    register={registerField("description", {
                        required: true,
                    })}
                />
                {errors.description && (
                    <span className="text-xs text-red-500">
                        This field is required
                    </span>
                )}
                <Button type="submit" visual="primary">
                    Create
                </Button>
            </form>
        </div>
    );
}
