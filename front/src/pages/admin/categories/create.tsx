import { useCallback } from "react";
import { useForm } from "react-hook-form";
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

    const onSubmit = useCallback(async (data: any) => {
        try {
            const res = await categoryService.createCategory(data);
            displayMsg(res.message, "success");
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    }, []);

    return (
        <div>
            Create category
            <form
                className="flex overflow-hidden rounded round-xl w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    type="text"
                    placeholder="Name"
                    register={registerField("name", {
                        required: true,
                    })}
                />
                <Input
                    type="text"
                    placeholder="Description"
                    register={registerField("description", {
                        required: true,
                    })}
                />
                <Button type="submit" visual="primary">
                    Create
                </Button>
            </form>
        </div>
    );
}
