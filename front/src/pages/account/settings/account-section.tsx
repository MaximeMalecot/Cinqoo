import AccountForm from "../../../components/user/account-form";
import { useAuthContext } from "../../../contexts/auth.context";
import { AccountData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg, notify } from "../../../utils/toast";

interface AccountFormProps {
    account: AccountData;
    reload: () => void;
}

export default function AccountSection({ account, reload }: AccountFormProps) {
    const { data: userData } = useAuthContext();

    const onSubmit = async (data: any) => {
        try {
            await userService.updateUser(userData!._id, data);
            reload();
            notify("Account updated");
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Basics</h2>
            {!account._id ? (
                <p>Loading</p>
            ) : (
                <AccountForm initData={account} onSubmit={onSubmit} />
            )}
        </div>
    );
}
