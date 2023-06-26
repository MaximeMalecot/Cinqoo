import { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAuthContext } from "../../../contexts/auth.context";
import userService from "../../../services/user.service";
import { displayMsg, notify } from "../../../utils/toast";

export default function PasswordSection() {
    const { data } = useAuthContext();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm();

    const onSubmit = useCallback(
        async (receivedData: any) => {
            const { oldPassword, passwordBis, password } = receivedData;

            if (password !== passwordBis) {
                setError("password", {
                    message: "The passwords don't match",
                });
                setError("passwordBis", {
                    message: "The passwords don't match",
                });
                return;
            }
            try {
                const res = await userService.updatePassword(
                    data!._id,
                    oldPassword,
                    password
                );
                if (res) {
                    notify("Password updated");
                }
            } catch (e: any) {
                console.error(e.message);
                displayMsg(e.message, "error");
            }
            reset();
        },
        [data]
    );

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
                    register={registerField("oldPassword", {
                        required: true,
                        minLength: 8,
                    })}
                />
                {errors.oldPassword && (
                    <p>{errors.oldPassword.message as string}</p>
                )}
                <Input
                    type="password"
                    placeholder="New password"
                    register={registerField("password", {
                        required: true,
                        minLength: 8,
                    })}
                />
                {errors.password && <p>{errors.password.message as string}</p>}
                <Input
                    type="password"
                    placeholder="Confirmation"
                    register={registerField("passwordBis", {
                        required: true,
                        minLength: 8,
                    })}
                />
                {errors.passwordBis && (
                    <p>{errors.passwordBis.message as string}</p>
                )}
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
