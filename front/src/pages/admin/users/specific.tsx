import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserBills from "../../../components/admin/bills/user-bills";
import UserOrders from "../../../components/admin/orders/user-orders";
import { PrestationItemList } from "../../../interfaces/prestation";
import { Review } from "../../../interfaces/review";
import { UserData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminUser() {
    const { id } = useParams();
    const [user, setUser] = useState<UserData | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchUser = async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await userService.getUser(id);
            console.log(res);
            setUser(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            User
            <div>
                <UserOrders userId={user._id} />
                <UserBills userId={user._id} />
            </div>
        </div>
    );
}
