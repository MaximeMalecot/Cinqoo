import { useForm } from "react-hook-form";
import { AccountData } from "../../interfaces/user";
import Button from "../button";
import { Input } from "../input";

interface AccountFormProps {
    initData: AccountData;
    onSubmit: (data: any) => void;
}

export default function AccountForm({ initData, onSubmit }: AccountFormProps) {
    const { register: registerField, handleSubmit } = useForm();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 py-0"
        >
            <Input
                placeholder="Email address"
                register={registerField("email", {
                    required: true,
                    value: initData.email,
                })}
            />
            <Input
                placeholder="Name"
                register={registerField("username", {
                    required: true,
                    value: initData.username,
                })}
            />
            <div className="w-full flex flex-col gap-5">
                <Button visual="primary" type="submit" className="flex-1">
                    Save
                </Button>
            </div>
        </form>
    );
}
