import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { Input } from "../components/input";
import { useAuthContext } from "../contexts/auth.context";

export default function Register() {
    const { register, isConnected } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback(async (data: any) => {
        try {
            setLoading(true);
            const { password, username, email } = data;
            await register(email, password, username);
        } catch (e: any) {
            console.log(e.message);
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
                    <h1 className="text-2xl px-5">Register</h1>
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
                            placeholder="Username"
                            type="text"
                            register={registerField("username", {
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
                        <button
                            className="btn btn-primary"
                            disabled={loading}
                            type="submit"
                        >
                            {loading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Sign up
                        </button>
                    </form>
                    <div className="divider m-0 py-0" />
                    <div className="p-5 py-0 flex gap-2 justify-center">
                        <p>Already a member? </p>
                        <Link to="/login" className="text-primary">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
