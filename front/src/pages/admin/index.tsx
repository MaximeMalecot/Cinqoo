import { Route, Routes } from "react-router-dom";

export default function AdminRouter() {
    return (
        <Routes>
            <Route path="/" element={<div>Admin</div>} />
            <Route path="/users" element={<div>Users</div>} />
            <Route path="/users/:id" element={<div>User</div>} />
            <Route path="/prestations" element={<div>Prestations</div>} />
            <Route path="/prestations/:id" element={<div>Prestation</div>} />
            <Route path="/orders/:id" element={<div>Order</div>} />
            <Route path="/categories" element={<div>Categories</div>} />
            <Route path="/categories/:id" element={<div>Category</div>} />
            <Route
                path="/categories/create"
                element={<div>Create category</div>}
            />
            <Route path="/report_reason" element={<div>Report reasons</div>} />
            <Route
                path="/report_reason/:id"
                element={<div>Report reason</div>}
            />
            <Route
                path="/report_reason/create"
                element={<div>Create report reason</div>}
            />
        </Routes>
    );
}
