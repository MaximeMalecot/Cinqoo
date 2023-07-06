import { useAnalytics } from "ratflow-sdk-react-rollup";
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useAuthContext } from "./contexts/auth.context";
import AppLayout from "./layout/app-layout";
import HomeLayout from "./layout/home-layout";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

function App() {
    const { pathname } = useLocation();
    const { setCurrentPage } = useAnalytics();
    const { isConnected } = useAuthContext();
    const Login = lazy(() => import("./pages/login"));
    const Register = lazy(() => import("./pages/register"));
    const AccountSettings = lazy(() => import("./pages/account/settings"));

    const Prestation = lazy(() => import("./pages/prestation"));
    const Prestations = lazy(() => import("./pages/prestations"));
    const Freelancer = lazy(() => import("./pages/freelancer"));
    const Favorites = lazy(() => import("./pages/favorites"));
    const TermsOfService = lazy(() => import("./pages/terms-of-service"));

    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route element={<AppLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/prestations" element={<Prestations />} />
                    <Route path="/prestations/:id" element={<Prestation />} />
                    <Route path="/freelancer/:id" element={<Freelancer />} />
                    <Route path="*" element={<NotFound />} />
                    <Route
                        path="/terms-of-service"
                        element={<TermsOfService />}
                    />
                    {isConnected && (
                        <>
                            <Route
                                path="/account/favorites"
                                element={<Favorites />}
                            />
                            <Route
                                path="/account/settings"
                                element={<AccountSettings />}
                            />
                        </>
                    )}
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
