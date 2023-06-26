import { useCallback, useState } from "react";
import Button from "../../components/button";
import { useAuthContext } from "../../contexts/auth.context";
import { displayMsg } from "../../utils/toast";
import PromptReportModal from "./prompt-report-modal";

interface ReportPartProps {
    prestationId: string;
}

export default function ReportPart({ prestationId }: ReportPartProps) {
    const { isConnected } = useAuthContext();
    const [showModal, setShowModal] = useState(false);

    const openReportModal = useCallback(async () => {
        try {
            if (!isConnected) {
                throw new Error("You must be connected to report a prestation");
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
                prestationId={prestationId}
                isOpen={showModal}
                setIsOpen={setShowModal}
            />
        </>
    );
}
