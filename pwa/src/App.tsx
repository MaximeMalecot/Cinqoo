import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuthContext } from "./contexts/auth.context";
import AppLayout from "./layout/app-layout";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

function App() {
    const { isConnected } = useAuthContext();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route element={<AppLayout />}>
                    {isConnected && <></>}
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
