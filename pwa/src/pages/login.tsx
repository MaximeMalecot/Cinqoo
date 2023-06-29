import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import Button from "../components/button";
import { Input } from "../components/input";
import { useAuthContext } from "../contexts/auth.context";
import { displayMsg } from "../utils/toast";

export default function Login() {
    const { login, isConnected } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback(async (data: any) => {
        try {
            setLoading(true);
            const { password, email } = data;
            await login(email, password);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    }, []);

    if (isConnected) {
        return <Navigate to="/"></Navigate>;
    }

    return (
        <div className="container mx-auto">
            <div className="flex flex justify-center p-5">
                <div className="flex flex-col gap-5 bg-white border border-1 border-slate-300 drop-shadow-xl rounded rounded-md w-full md:w-2/5 py-10">
                    <h1 className="text-2xl px-5">Login</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 p-5 py-0"
                    >
                        <Input
                            placeholder="Mail address"
                            type="email"
                            register={registerField("email", {
                                required: true,
                            })}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            register={registerField("password", {
                                required: true,
                            })}
                        />
                        <Button
                            disabled={loading}
                            visual={"bordered-primary"}
                            type="submit"
                        >
                            {loading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Login
                        </Button>
                        <Link
                            to="/password-forgotten"
                            className="text-primary text-sm"
                        >
                            Forgot password?
                        </Link>
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
