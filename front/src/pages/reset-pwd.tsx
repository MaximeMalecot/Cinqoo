import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import { Input } from "../components/input";
import userService from "../services/user.service";
import { displayMsg } from "../utils/toast";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                if (!token) return;
                setLoading(true);
                const { password } = data;
                await userService.resetPassword(password, token);
                navigate("/");
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    return (
        <div className="container mx-auto">
            <div className="flex flex justify-center p-5">
                <div className="flex flex-col gap-5 bg-white border border-1 border-slate-300 drop-shadow-xl rounded rounded-md w-full md:w-2/5 py-10">
                    <h1 className="text-2xl px-5">Forgot password</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 p-5 py-0"
                    >
                        <Input
                            placeholder="Password"
                            type="password"
                            register={registerField("password", {
                                required: true,
                            })}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 italic px-3">
                                This field is required
                            </p>
                        )}
                        <Button
                            disabled={loading}
                            visual={"bordered-primary"}
                            type="submit"
                        >
                            {loading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Reset password
                        </Button>
                    </form>
                    <div className="divider m-0 py-0" />
                    <div className="p-5 py-0 flex gap-2 justify-center">
                        <p>Not a member yet? </p>
                        <Link to="/register" className="text-primary">
                            Join now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
