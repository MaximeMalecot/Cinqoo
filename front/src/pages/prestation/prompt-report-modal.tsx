import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

interface PromptReportModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    confirm: () => void;
}

export default function PromptReportModal({
    isOpen,
    setIsOpen,
    confirm,
}: PromptReportModalProps) {
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
            openDialog();
        } else if (dialogRef?.current?.open) {
            closeDialog();
        }
    }, [isOpen]);

    const onSubmit = useCallback((data: any) => {
        confirm();
        setIsOpen(false);
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
                    <p className="text-md">
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
                        <input
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-primary w-full"
                            type="submit"
                            value="Report"
                        ></input>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
