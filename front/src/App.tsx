import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "./contexts/auth.context";
import AppLayout from "./layout/app-layout";
import HomeLayout from "./layout/home-layout";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const BecomeFreelancer = lazy(() => import("./pages/become-freelancer"));
const Account = lazy(() => import("./pages/account"));
const AccountPrestations = lazy(() => import("./pages/account/prestations"));
const CreatePrestation = lazy(
    () => import("./pages/account/prestations/create")
);

function App() {
    const { isConnected } = useAuthContext();
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route element={<AppLayout />}>
                    <Route
                        path="/become-freelancer"
                        element={<BecomeFreelancer />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {isConnected && (
                        <>
                            <Route path="/account">
                                <Route
                                    path="/account/prestations/create"
                                    element={<CreatePrestation />}
                                />
                                <Route
                                    path="/account/prestations"
                                    element={<AccountPrestations />}
                                />
                                <Route path="/account" element={<Account />} />
                            </Route>
                        </>
                    )}

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
