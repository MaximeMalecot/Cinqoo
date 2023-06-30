import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountForm from "../../../components/user/account-form";
import { AccountData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg, notify } from "../../../utils/toast";

export default function AdminEditUser() {
    const { id } = useParams();
    const [user, setUser] = useState<AccountData | null>(null);

    const fetchUser = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await userService.getUser(id);
            setUser(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    const updateUser = async (data: any) => {
        try {
            await userService.updateUser(id!, data);
            fetchUser();
            notify("Account updated");
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex flex-col w-full overflow-hidden">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full flex flex-col gap-5">
                    <div className="text-sm breadcrumbs">
                        <ul>
                            <li>
                                <Link to={`/admin/users`}>Users</Link>
                            </li>
                            <li>
                                <Link to={`/admin/users/${user._id}`}>
                                    User {id}
                                </Link>
                            </li>
                            <li>Edit</li>
                        </ul>
                    </div>
                    <AccountForm initData={user} onSubmit={updateUser} />
                </div>
            </section>
        </div>
    );
}
