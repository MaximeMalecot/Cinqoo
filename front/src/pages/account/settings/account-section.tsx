import AccountForm from "../../../components/user/account-form";
import { AccountData } from "../../../interfaces/user";

interface AccountFormProps {
    account: AccountData;
}

export default function AccountSection({ account }: AccountFormProps) {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Basics</h2>
            {!account._id ? (
                <p>Loading</p>
            ) : (
                <AccountForm initData={account} onSubmit={(d) => null} />
            )}
        </div>
    );
}
