import { Route, Routes } from "react-router-dom";
import AdminCategories from "./categories";
import CreateCategory from "./categories/create";
import AdminCategory from "./categories/specific";
import AdminOrder from "./order";
import AdminPrestations from "./prestations";
import AdminPrestation from "./prestations/specific";
import AdminReportReasons from "./report_reason";
import CreateReportReason from "./report_reason/create";
import AdminReportReason from "./report_reason/specific";
import AdminUsers from "./users";
import AdminUser from "./users/specific";

export default function AdminRouter() {
    return (
        <Routes>
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/users/:id" element={<AdminUser />} />
            <Route path="/prestations" element={<AdminPrestations />} />
            <Route path="/prestations/:id" element={<AdminPrestation />} />
            <Route path="/orders/:id" element={<AdminOrder />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/categories/:id" element={<AdminCategory />} />
            <Route path="/categories/create" element={<CreateCategory />} />
            <Route path="/report_reason" element={<AdminReportReasons />} />
            <Route path="/report_reason/:id" element={<AdminReportReason />} />
            <Route
                path="/report_reason/create"
                element={<CreateReportReason />}
            />
            <Route path="*" element={<div>Not found</div>} />
            <Route path="/" element={<div>Admin</div>} />
        </Routes>
    );
}
