import { Link } from "react-router-dom";

interface HeaderProps {
    isSticky?: boolean;
}

export default function Header({ isSticky = false }: HeaderProps) {
    return (
        <header
            className={`navbar ${
                isSticky ? "static top-0 bg-transparent" : "bg-base-100"
            }`}
        >
            <div className="flex-1">
                <Link to="/" className="capitalize text-xl">
                    cinqoo
                </Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/discover">Discover</Link>
                    </li>{" "}
                    <li>
                        <Link to="/become-freelancer">Become freelancer</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
