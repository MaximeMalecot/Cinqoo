import { lazy } from "react";
import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ADMIN_HEADER_TABS } from "../../constants/header-tabs";
import AdminCategories from "./categories";
import CreateCategory from "./categories/create";
import AdminCategory from "./categories/specific";
import AdminOrder from "./order";
import AdminPrestation from "./prestation";
import AdminPrestations from "./prestations";
import AdminReportReasons from "./report_reason";
import CreateReportReason from "./report_reason/create";
import AdminReportReason from "./report_reason/specific";
import AdminUser from "./user";
import AdminEditUser from "./user_edit";
import AdminUsers from "./users";

const AdminQuiz = lazy(() => import("./quiz"));
const AdminCreateQuiz = lazy(() => import("./quiz/create"));
const AdminEditQuiz = lazy(() => import("./quiz/edit"));

function AdminLayout() {
    return (
        <div>
            <div className="py-5 border border-b2 border-base-200">
                <ul className="flex flex-wrap justify-start md:justify-center items-center gap-5">
                    {ADMIN_HEADER_TABS.map((tab) => (
                        <li
                            key={tab.path}
                            className="text-xl btn bg-transparent border-none capitalize font-normal"
                        >
                            <NavLink
                                to={tab.path}
                                className={({ isActive }) =>
                                    isActive ? "underline" : ""
                                }
                            >
                                {tab.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <Outlet />
        </div>
    );
}

export default function AdminRouter() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/users/:id/edit" element={<AdminEditUser />} />
                <Route path="/users/:id" element={<AdminUser />} />
                <Route path="/prestations" element={<AdminPrestations />} />
                <Route path="/prestations/:id" element={<AdminPrestation />} />
                <Route path="/orders/:id" element={<AdminOrder />} />
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="/categories/:id" element={<AdminCategory />} />
                <Route path="/categories/create" element={<CreateCategory />} />
                <Route path="/report_reason" element={<AdminReportReasons />} />
                <Route
                    path="/report_reason/:id"
                    element={<AdminReportReason />}
                />
                <Route
                    path="/report_reason/create"
                    element={<CreateReportReason />}
                />
                <Route path="*" element={<div>Not found</div>} />
                <Route path="/" element={<Navigate to={"/admin/users"} />} />
                <Route path="/quiz/create" element={<AdminCreateQuiz />} />
                <Route path="/quiz/:id" element={<AdminEditQuiz />} />
                <Route path="/quiz" element={<AdminQuiz />} />
            </Route>
        </Routes>
    );
}
