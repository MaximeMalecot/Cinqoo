import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserBills from "../../../components/admin/bills/user-bills";
import UserOrders from "../../../components/admin/orders/user-orders";
import UserPrestations from "../../../components/admin/prestations/user-prestations";
import UserReports from "../../../components/admin/reports/user-reports";
import UserReviews from "../../../components/admin/reviews/review-by-user";
import FreelancerProfile from "../../../components/admin/users/freelancer-profile";
import Button from "../../../components/button";
import { ROLES } from "../../../constants/roles";
import { AccountData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";
import DangerZone from "./danger-zone";

export default function AdminUser() {
    const { id } = useParams();
    const [user, setUser] = useState<AccountData | null>(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await userService.getUser(id);
            setUser(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
            navigate("/admin/users");
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
                    <UserPart user={user} />
                    {user.roles.includes(ROLES.FREELANCER) && (
                        <>
                            <FreelancerProfile freelancerId={user._id} />
                        </>
                    )}
                    <UserPrestations userId={user._id} />
                    <div className="divider my-0" />
                    <UserOrders userId={user._id} />
                    <div className="divider my-0" />
                    <UserBills userId={user._id} />
                    <div className="divider my-0" />
                    <UserReports userId={user._id} />
                    <div className="divider my-0" />
                    <UserReviews userId={user._id} />
                    <div className="divider my-0" />
                    <DangerZone userId={user._id} />
                </div>
            </section>
        </div>
    );
}

function UserPart({ user }: { user: AccountData }) {
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-4xl">{user.username}</h1>
            <div className="flex flex-col  rounded-md border border-1 p-5">
                <div className="flex gap-5">
                    <p>Email:</p>
                    <p>{user.email}</p>
                </div>
                <div className="flex gap-5">
                    <p>roles:</p>
                    <p>{user.roles.join(", ")}</p>
                </div>
                <div className="flex gap-5">
                    <p>Stripe account id:</p>
                    <p>{user.stripeAccountId}</p>
                </div>
                {user.createdAt && (
                    <div className="flex gap-5">
                        <p>Registration date:</p>
                        <p>{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                )}
                <Link to={`/admin/users/${user._id}/edit`}>
                    <Button visual={"bordered-primary"} className="w-fit px-10">
                        Edit
                    </Button>
                </Link>
            </div>
        </div>
    );
}
