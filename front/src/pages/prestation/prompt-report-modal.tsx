import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextArea } from "../../components/text-area";
import { useAuthContext } from "../../contexts/auth.context";
import useReport from "../../hooks/use-report";
import { displayMsg, notify } from "../../utils/toast";

interface PromptReportModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    prestationId: string;
}

export default function PromptReportModal({
    prestationId,
    isOpen,
    setIsOpen,
}: PromptReportModalProps) {
    const { reasons, loading, report } = useReport({ type: "SERVICE" });
    const { isConnected } = useAuthContext();

    const dialogRef = useRef<HTMLDialogElement>(null);
    const {
        register: registerField,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm();

    const openDialog = () => {
        if (!dialogRef.current) return;
        dialogRef.current.removeAttribute("open");
        dialogRef.current?.showModal();
    };

    const closeDialog = () => {
        if (!dialogRef.current) return;
        reset();
        dialogRef.current?.close();
    };

    useEffect(() => {
        if (isOpen && dialogRef?.current?.close) {
            reset();
            openDialog();
        } else if (dialogRef?.current?.open) {
            reset();
            closeDialog();
        }
    }, [isOpen]);

    const onSubmit = useCallback(async (data: any) => {
        try {
            if (!isConnected) {
                throw new Error("You must be connected to report a prestation");
            }
            console.log(data);
            const res = await report(
                prestationId,
                data.reason,
                data.description
            );
            if (res.success) {
                setIsOpen(false);
                notify("Report sent");
            } else {
                throw new Error(res.message);
            }
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, []);

    return (
        <>
            <dialog
                ref={dialogRef}
                onClose={() => setIsOpen(false)}
                className="modal"
            >
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg">Report a prestation</h3>
                    <p className="text-xs">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur aperiam, voluptatibus molestiae distinctio
                        maxime harum, neque tempora atque cumque ipsum nemo
                        similique sequi fugiat beatae! Asperiores, tempore.
                        Aliquid, ea maxime!
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-3"
                    >
                        <select
                            className="border border-1 border-slate-300 !outline-none p-2 rounded-md capitalize"
                            {...registerField("reason")}
                        >
                            {reasons.length === 0 ? (
                                <option disabled>No reason available</option>
                            ) : (
                                reasons.map((r, index) => (
                                    <option key={index} value={r._id}>
                                        {r.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <TextArea
                            placeholder="Description"
                            register={registerField("description", {
                                required: true,
                            })}
                        />
                        <button
                            disabled={loading}
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-primary w-full"
                            type="submit"
                        >
                            Report
                            {loading && (
                                <span className="loading loading-spinner"></span>
                            )}
                        </button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
