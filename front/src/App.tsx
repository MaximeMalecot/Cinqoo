import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "./contexts/auth.context";
import AppLayout from "./layout/app-layout";
import HomeLayout from "./layout/home-layout";
import AdminRouter from "./pages/admin";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const ForgotPassword = lazy(() => import("./pages/forgot-pwd"));
const ResetPassword = lazy(() => import("./pages/reset-pwd"));
const BecomeFreelancer = lazy(() => import("./pages/become-freelancer"));
const AccountSettings = lazy(() => import("./pages/account/settings"));
const AccountPrestations = lazy(() => import("./pages/account/prestations"));
const ManageFreelancerProfile = lazy(
    () => import("./pages/account/manage-freelancer-profile")
);
const CreatePrestation = lazy(
    () => import("./pages/account/prestations/create")
);
const ManageOrder = lazy(() => import("./pages/account/manage-order"));
const ManageRequest = lazy(() => import("./pages/account/manage-request"));
const EditPrestation = lazy(() => import("./pages/account/prestations/edit"));
const Orders = lazy(() => import("./pages/account/orders"));
const Requests = lazy(() => import("./pages/account/requests"));
const Prestation = lazy(() => import("./pages/prestation"));
const Prestations = lazy(() => import("./pages/prestations"));
const Favorites = lazy(() => import("./pages/favorites"));
const Freelancer = lazy(() => import("./pages/freelancer"));
const TermsOfService = lazy(() => import("./pages/terms-of-service"));
const EvaluateSkills = lazy(
    () => import("./pages/account/skills-assessments/evaluate-skills")
);
const PreQuiz = lazy(
    () => import("./pages/account/skills-assessments/pre-quiz")
);
const Quiz = lazy(() => import("./pages/account/skills-assessments/quiz"));

function App() {
    const { isConnected, isFreelancer, isAdmin } = useAuthContext();
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
                    <Route
                        path="/password-forgotten"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={<ForgotPassword />}
                    />
                    <Route path="/prestations" element={<Prestations />} />
                    <Route path="/prestations/:id" element={<Prestation />} />
                    <Route path="/freelancer/:id" element={<Freelancer />} />
                    <Route
                        path="/terms-of-service"
                        element={<TermsOfService />}
                    />
                    {isConnected && (
                        <>
                            <Route path="/account">
                                {isFreelancer && (
                                    <>
                                        <Route
                                            path="/account/prestations/:id/edit"
                                            element={<EditPrestation />}
                                        />
                                        <Route
                                            path="/account/prestations/create"
                                            element={<CreatePrestation />}
                                        />
                                        <Route
                                            path="/account/prestations"
                                            element={<AccountPrestations />}
                                        />
                                        <Route
                                            path="/account/manage-freelancer-profile"
                                            element={
                                                <ManageFreelancerProfile />
                                            }
                                        />
                                        <Route
                                            path="/account/requests/:id"
                                            element={<ManageRequest />}
                                        />
                                        <Route
                                            path="/account/requests"
                                            element={<Requests />}
                                        />
                                        <Route
                                            path="/account/skills-assessments"
                                            element={<EvaluateSkills />}
                                        />
                                        <Route
                                            path="/account/skills-assessments/quiz/:id"
                                            element={<Quiz />}
                                        />
                                        <Route
                                            path="/account/skills-assessments/:id"
                                            element={<PreQuiz />}
                                        />
                                    </>
                                )}
                                <Route
                                    path="/account/favorites"
                                    element={<Favorites />}
                                />
                                <Route
                                    path="/account/orders/:id"
                                    element={<ManageOrder />}
                                />
                                <Route
                                    path="/account/orders"
                                    element={<Orders />}
                                />
                                <Route
                                    path="/account/settings"
                                    element={<AccountSettings />}
                                />
                            </Route>
                            {isAdmin && (
                                <Route
                                    path="/admin/*"
                                    element={<AdminRouter />}
                                />
                            )}
                        </>
                    )}

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
