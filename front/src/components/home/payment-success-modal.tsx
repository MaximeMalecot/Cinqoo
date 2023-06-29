import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import Button from "../button";

export default function PaymentSuccessModal() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { isConnected } = useAuthContext();

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
                    Thanks for your payment! ✅
                </h3>
                <p className="py-4">
                    Stripe will now take a few seconds to process your payment.
                </p>
                <p>
                    Once it's done, you'll be able to see and follow your order
                    in your account.
                </p>

                <div className="modal-action">
                    {isConnected && (
                        <Link
                            className="ml-auto w-fit !outline-none"
                            to={`/account/orders`}
                            state={{ scrollToPublishReview: true }}
                        >
                            <Button className="w-fit">Your orders</Button>
                        </Link>
                    )}
                    <button className="btn !outline-none ml-auto">Close</button>
                </div>
            </form>
        </dialog>
    );
}
