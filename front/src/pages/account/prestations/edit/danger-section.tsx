import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/button";
import { PrestationItemList } from "../../../../interfaces/prestation";
import prestationService from "../../../../services/prestation.service";
import { displayMsg, notify } from "../../../../utils/toast";
import PromptDeleteModal from "./prompt-delete-modal";

interface SectionProps {
    prestation: PrestationItemList;
}

export default function DangerSection({ prestation }: SectionProps) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const deleteAccount = async () => {
        try {
            await prestationService.deletePrestation(prestation._id);
            notify("Prestation deleted");
            navigate("/account/prestations");
        } catch (e: any) {
            console.error(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Danger Zone 🚨</h2>
            <Button visual="danger" onClick={() => setShowModal(true)}>
                Delete prestation
            </Button>
            <PromptDeleteModal
                isOpen={showModal}
                setIsOpen={setShowModal}
                confirm={deleteAccount}
            />
        </div>
    );
}
