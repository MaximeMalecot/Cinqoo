import { Route, Routes } from "react-router-dom";
import AdminCategories from "./categories";
import AdminCategory from "./categories/specific";
import AdminPrestations from "./prestations";
import AdminPrestation from "./prestations/specific";
import AdminReportReasons from "./report_reason";
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
            <Route path="/orders/:id" element={<div>Order</div>} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/categories/:id" element={<AdminCategory />} />
            <Route
                path="/categories/create"
                element={<div>Create category</div>}
            />
            <Route path="/report_reason" element={<AdminReportReasons />} />
            <Route path="/report_reason/:id" element={<AdminReportReason />} />
            <Route
                path="/report_reason/create"
                element={<div>Create report reason</div>}
            />
            <Route path="*" element={<div>Not found</div>} />
            <Route path="/" element={<div>Admin</div>} />
        </Routes>
    );
}
