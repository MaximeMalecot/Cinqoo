import { useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/auth.context";

export default function HomeHeader() {
    const { data, isConnected, logout, isFreelancer } = useAuthContext();
    const menuRef = useRef<HTMLDetailsElement>(null);

    return (
        <header className={`navbar fixed top-0 bg-transparent`}>
            <div className={`container mx-auto text-white `}>
                <div className="flex-1">
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
                                to="/discover"
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
                                <li>
                                    <details ref={menuRef}>
                                        <summary className="text-xl bg-transparent border border-white text-white hover:bg-white hover:text-black hover:border-transparent">
                                            {data?.email}
                                        </summary>
                                        <ul className="p-2 bg-transparent w-full text-black">
                                            <li>
                                                <Link to="/account">
                                                    Account
                                                </Link>{" "}
                                            </li>
                                            {isFreelancer && (
                                                <li>
                                                    <Link to="/account">
                                                        Prestations
                                                    </Link>{" "}
                                                </li>
                                            )}
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
