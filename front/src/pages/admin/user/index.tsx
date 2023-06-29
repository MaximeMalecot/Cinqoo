import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserBills from "../../../components/admin/bills/user-bills";
import UserOrders from "../../../components/admin/orders/user-orders";
import UserPrestations from "../../../components/admin/prestations/user-prestations";
import UserReports from "../../../components/admin/reports/user-reports";
import UserReviews from "../../../components/admin/reviews/review-by-user";
import FreelancerProfile from "../../../components/admin/users/freelancer-profile";
import { ROLES } from "../../../constants/roles";
import { UserData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminUser() {
    const { id } = useParams();
    const [user, setUser] = useState<UserData | null>(null);

    const fetchUser = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await userService.getUser(id);
            setUser(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex flex-col w-full overflow-hidden">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full flex flex-col gap-5">
                    <div className="flex gap-1">
                        <h1 className="text-4xl">
                            {user.username} - {user._id}
                        </h1>
                    </div>
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
                </div>
            </section>
        </div>
    );
}
