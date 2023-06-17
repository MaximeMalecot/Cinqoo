import { Link } from "react-router-dom";

export default function HomeHeader() {
    return (
        <header className={`navbar fixed top-0 bg-transparent`}>
            <div className={`container mx-auto text-white`}>
                <div className="flex-1">
                    <Link to="/" className="capitalize text-2xl font-bold">
                        cinqoo
                    </Link>
                </div>
                <div className="flex-none hidden md:block">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link className="text-xl" to="/discover">
                                Discover
                            </Link>
                        </li>{" "}
                        <li>
                            <Link className="text-xl" to="/become-freelancer">
                                Become freelancer
                            </Link>
                        </li>
                        <li>
                            <Link className="text-xl" to="/login">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link className="text-xl" to="/register">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
