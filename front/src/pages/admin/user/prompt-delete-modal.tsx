import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

interface PromptDeleteModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    confirm: () => void;
}

const VALIDATION_STRING = "Delete this account";

export default function PromptDeleteModal({
    isOpen,
    setIsOpen,
    confirm,
}: PromptDeleteModalProps) {
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
        if (data.name !== VALIDATION_STRING) {
            setError("name", { message: "The name you entered is incorrect" });
            return;
        }
        confirm();
        reset();
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
                    <h3 className="font-bold text-lg">
                        🚨 Are you sure you want to delete this account? 🚨
                    </h3>
                    <p className="text-md">
                        This action is irreversible. The data will be lost
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-3"
                    >
                        <p className="text-sm font-bold">
                            To confirm, type "{VALIDATION_STRING}" below:
                        </p>
                        <input
                            className="input input-bordered w-full w-full border-1 border-red-500 !outline-none outline-0	"
                            type="text"
                            {...registerField("name", { required: true })}
                        />
                        {errors.name && (
                            <span>{errors.name.message as string}</span>
                        )}

                        <input
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-primary w-full"
                            type="submit"
                            value="Let's go! 💥"
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
