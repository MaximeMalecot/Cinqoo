import { useCallback, useState } from "react";
import Button from "../../components/button";
import { useAuthContext } from "../../contexts/auth.context";
import { displayMsg } from "../../utils/toast";
import PromptReportModal from "../prestation/prompt-report-modal";

interface ReportPartProps {
    userId: string;
}

export default function ReportPart({ userId }: ReportPartProps) {
    const { isConnected } = useAuthContext();
    const [showModal, setShowModal] = useState(false);

    const openReportModal = useCallback(async () => {
        try {
            if (!isConnected) {
                throw new Error("You must be connected to report a user");
            }
            setShowModal(true);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    return (
        <>
            <Button
                onClick={openReportModal}
                visual={"danger"}
                className="w-full"
            >
                Report
            </Button>
            <PromptReportModal
                type="USER"
                targetId={userId}
                isOpen={showModal}
                setIsOpen={setShowModal}
            />
        </>
    );
}
