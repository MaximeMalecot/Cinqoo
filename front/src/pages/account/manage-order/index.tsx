import { Link, useParams } from "react-router-dom";

export default function ManageOrder() {
    const { id } = useParams();

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <p>Account</p>
                    </li>
                    <li>
                        <Link to="/account/orders">Orders</Link>
                    </li>
                    <li>Order #{id}</li>
                </ul>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Manage order</h1>
            </div>
        </div>
    );
}
