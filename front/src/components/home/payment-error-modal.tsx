import { useEffect, useRef } from "react";

export default function PaymentErrorModal() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = () => {
        if (!dialogRef.current) return;
        dialogRef.current.removeAttribute("open");
        dialogRef.current?.showModal();
    };

    useEffect(() => {
        const timeOut = setTimeout(() => {
            openDialog();
        }, 1000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);

    return (
        <dialog ref={dialogRef} className="modal">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">
                    Something went wrong with your payment
                </h3>
                <p className="py-4">
                    Your payment has either been rejected or been cancelled.
                    Please try again.
                </p>

                <div className="modal-action mt-0 flex flex-col">
                    <p>
                        If this problem persists, please contact our{" "}
                        <a
                            className="underline font-bold !outline-none"
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D"
                            target="_blank"
                        >
                            customer help center
                        </a>
                        .
                    </p>
                    <button className="btn w-fit ml-auto !outline-none">
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    );
}
