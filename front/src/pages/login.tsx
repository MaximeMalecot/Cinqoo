import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/auth.context";

export default function Login() {
    const { login, isConnected } = useAuthContext();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = useCallback((data: any) => {}, []);

    if (isConnected) {
        return <Navigate to="/"></Navigate>;
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" {...registerField("email")} />
                <input type="password" {...registerField("password")} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
