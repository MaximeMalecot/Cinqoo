import { useCallback, useEffect, useState } from "react";
import { AccountData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";
import AccountSection from "./account-section";
import DangerSection from "./danger-section";
import PasswordSection from "./password-section";

export default function Account() {
    const [account, setAccount] = useState<AccountData>({
        _id: "",
        email: "",
        username: "",
        stripeAccountId: "",
        roles: [],
    });

    const fetchUser = useCallback(async () => {
        try {
            const user = await userService.getSelf();
            setAccount(user);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col md:flex-row justify-between">
                <h1 className="text-2xl">Account settings</h1>
            </div>
            <AccountSection account={account} reload={fetchUser} />
            <div className="divider my-0"></div>
            <PasswordSection />
            <div className="divider my-0"></div>
            <DangerSection />
        </div>
    );
}
