import { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/button";
import { Input } from "../../../components/input";

export default function PasswordSection() {
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback((data: any) => {}, []);

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Credentials</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 py-0"
            >
                <Input
                    type="password"
                    placeholder="Current password"
                    register={registerField("password", {
                        required: true,
                    })}
                />
                <Input
                    type="password"
                    placeholder="New password"
                    register={registerField("password", {
                        required: true,
                    })}
                />
                <Input
                    type="password"
                    placeholder="Confirmation"
                    register={registerField("passwordBis", {
                        required: true,
                    })}
                />
                <div className="w-full flex flex-col gap-5">
                    <Button
                        visual="bordered-primary"
                        type="submit"
                        className="flex-1"
                    >
                        Apply
                    </Button>
                </div>
            </form>
        </div>
    );
}
