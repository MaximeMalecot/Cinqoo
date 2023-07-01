import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer bg-black text-base-content">
            <div className="container mx-auto py-10 text-white flex md:block justify-center items-center">
                <Link
                    to="/"
                    className="capitalize text-2xl font-bold hover:opacity-75"
                >
                    Cinqoo
                </Link>
                <p>© 2023</p>
            </div>
        </footer>
    );
}
