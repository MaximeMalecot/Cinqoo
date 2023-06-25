import { Link } from "react-router-dom";
import { FREELANCER_TABS, USER_TABS } from "../constants/header-tabs";
import { useAuthContext } from "../contexts/auth.context";

export default function Header() {
    const { data, isConnected, logout, isFreelancer } = useAuthContext();

    return (
        <header
            style={{ position: "relative", zIndex: 10000 }}
            className={`navbar top-0 relative bg-base-100 border border-b2 border-base-200`}
        >
            <div className={`container mx-auto `}>
                <div className="flex-1">
                    <Link
                        to="/"
                        className="capitalize text-2xl font-bold hover:opacity-75"
                    >
                        cinqoo
                    </Link>
                </div>
                <div className="flex-none hidden md:block">
                    <ul className="menu menu-horizontal px-1 flex items-center gap-2">
                        <li>
                            <Link className="text-xl" to="/prestations">
                                Discover
                            </Link>
                        </li>
                        <li>
                            <Link className="text-xl" to="/become-freelancer">
                                Become freelancer
                            </Link>
                        </li>
                        {isConnected ? (
                            <>
                                <li>
                                    <details>
                                        <summary className="text-xl">
                                            {data?.email}
                                        </summary>
                                        <ul className="p-2 bg-base-100 w-full">
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
                                    <Link className="text-xl" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="text-xl bg-transparent border border-primary text-primary hover:bg-primary hover:text-white hover:border-transparent"
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
