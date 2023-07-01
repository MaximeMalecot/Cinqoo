import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import userService from "../../../services/user.service";
import { displayMsg, notify } from "../../../utils/toast";
import PromptDeleteModal from "./prompt-delete-modal";

export default function DangerZone({ userId }: { userId: string }) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const deleteAccount = async () => {
        try {
            await userService.deleteAccount(userId);
            notify("Account soft deleted");
            navigate("/admin/users");
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Danger Zone 🚨</h2>
            <Button visual="danger" onClick={() => setShowModal(true)}>
                Delete this user
            </Button>
            <PromptDeleteModal
                isOpen={showModal}
                setIsOpen={setShowModal}
                confirm={deleteAccount}
            />
        </div>
    );
}
