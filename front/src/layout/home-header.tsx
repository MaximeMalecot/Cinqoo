import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    ADMIN_TABS,
    FREELANCER_TABS,
    USER_TABS,
} from "../constants/header-tabs";
import { useAuthContext } from "../contexts/auth.context";
import MobileMenu from "./mobile-menu";

export default function HomeHeader() {
    const { data, isConnected, logout, isFreelancer, isAdmin } =
        useAuthContext();
    const headerRef = useRef<HTMLHeadElement>(null);
    const subMenuRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const cb = (e: any) => {
            if (!subMenuRef?.current || !headerRef?.current) return;
            // if (subMenuRef.current.contains(e.target)) return;
            subMenuRef.current
                .getElementsByTagName("details")[0]
                .removeAttribute("open");
        };

        if (headerRef.current) {
            document.addEventListener("click", cb);

            return () => {
                document.removeEventListener("click", cb);
            };
        }
    }, [headerRef]);

    return (
        <header
            ref={headerRef}
            style={{ zIndex: 10000 }}
            className={`navbar fixed top-0 bg-primary`}
        >
            <MobileMenu />
            <div className={`container mx-auto text-white `}>
                <div className="md:flex-1" style={{ zIndex: 10000 }}>
                    <Link
                        to="/"
                        className="capitalize text-2xl font-bold hover:opacity-75"
                    >
                        Cinqoo
                    </Link>
                </div>
                <div className="flex-none hidden md:block">
                    <ul className="menu menu-horizontal px-1 flex items-center gap-2">
                        <li>
                            <Link
                                className="text-xl hover:text-white"
                                to="/prestations"
                            >
                                Discover
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="text-xl hover:text-white"
                                to="/become-freelancer"
                            >
                                Become freelancer
                            </Link>
                        </li>
                        {isConnected ? (
                            <>
                                <li ref={subMenuRef}>
                                    <details>
                                        <summary className="text-xl bg-transparent border border-white text-white hover:bg-white hover:text-black hover:border-transparent">
                                            {data?.email}
                                        </summary>
                                        <ul className="p-2 bg-transparent w-full text-black">
                                            {USER_TABS.map((tab, index) => (
                                                <li
                                                    key={index}
                                                    className="capitalize"
                                                >
                                                    <Link to={tab.path}>
                                                        {tab.name}
                                                    </Link>
                                                </li>
                                            ))}
                                            {isFreelancer &&
                                                FREELANCER_TABS.map(
                                                    (tab, index) => (
                                                        <li
                                                            key={index}
                                                            className="capitalize"
                                                        >
                                                            <Link to={tab.path}>
                                                                {tab.name}
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            {isAdmin &&
                                                ADMIN_TABS.map((tab, index) => (
                                                    <li
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        <Link to={tab.path}>
                                                            {tab.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            <li>
                                                <p onClick={logout}>Logout</p>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        className="text-xl hover:text-white"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="text-xl bg-transparent border border-white text-white hover:bg-white hover:text-black hover:border-transparent"
                                        to="/register"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}
