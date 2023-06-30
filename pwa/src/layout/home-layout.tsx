import { Outlet } from "react-router-dom";
import Footer from "./footer";
import HomeHeader from "./home-header";

export default function HomeLayout() {
    return (
        <div className="h-100 w-100">
            <HomeHeader />
            <main className="w-full min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
