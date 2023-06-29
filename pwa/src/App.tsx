import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuthContext } from "./contexts/auth.context";
import AppLayout from "./layout/app-layout";
import Home from "./pages/home";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import Register from "./pages/register";

function App() {
    const { isConnected } = useAuthContext();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route element={<AppLayout />}>
                    {isConnected && <></>}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
