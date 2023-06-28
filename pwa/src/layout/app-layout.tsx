import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";

export default function AppLayout() {
    return (
        <div className="h-100 w-100">
            <Header />
            <main className="w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
