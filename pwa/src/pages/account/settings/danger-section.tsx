import { useState } from "react";
import Button from "../../../components/button";
import { useAuthContext } from "../../../contexts/auth.context";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";
import PromptDeleteModal from "./prompt-delete-modal";

interface DangerSectionProps {}
export default function DangerSection({}: DangerSectionProps) {
    const [showModal, setShowModal] = useState(false);
    const { data, logout } = useAuthContext();

    const deleteAccount = async () => {
        try {
            const res = await userService.deleteAccount(data!._id);
            logout();
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Danger Zone 🚨</h2>
            <Button visual="danger" onClick={() => setShowModal(true)}>
                Delete my account
            </Button>
            <PromptDeleteModal
                isOpen={showModal}
                setIsOpen={setShowModal}
                confirm={deleteAccount}
            />
        </div>
    );
}
