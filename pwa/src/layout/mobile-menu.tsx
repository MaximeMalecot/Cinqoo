import { Divide } from "hamburger-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { USER_TABS } from "../constants/header-tabs";
import { useAuthContext } from "../contexts/auth.context";

interface MobileMenuProps {
    color?: string;
    bgColorClass?: string;
}
export default function MobileMenu({
    color = "white",
    bgColorClass = "bg-black",
}: MobileMenuProps) {
    const [open, setOpen] = useState(false);
    const openClasses = `${bgColorClass} opacity-80`;
    const { isConnected, logout } = useAuthContext();

    const wrapLogout = () => {
        logout();
        setOpen(false);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <div
            className={`md:hidden h-screen w-screen fixed top-0 left-0 flex flex-col items-center justify-center ${
                open ? openClasses : "pointer-events-none"
            }`}
        >
            <div
                className="absolute top-3 right-1 pointer-events-auto"
                style={{ zIndex: 10000 }}
            >
                <Divide
                    size={24}
                    color={open ? "white" : color}
                    toggle={(val) => setOpen(val)}
                    toggled={open}
                />
            </div>
            {open && (
                <ul
                    className="relative menu menu-vertical flex flex-col items-center gap-2 text-xl text-white capitalize"
                    style={{ zIndex: 10001 }}
                >
                    {isConnected &&
                        USER_TABS.map((tab, index) => (
                            <li key={index} className="capitalize">
                                <Link onClick={closeMenu} to={tab.path}>
                                    {tab.name}
                                </Link>
                            </li>
                        ))}
                    {isConnected && (
                        <li>
                            <p onClick={wrapLogout}>Logout</p>
                        </li>
                    )}

                    {!isConnected && (
                        <>
                            <li>
                                <Link onClick={closeMenu} to="/login">
                                    login
                                </Link>
                            </li>
                            <li>
                                <Link onClick={closeMenu} to="/register">
                                    register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}
