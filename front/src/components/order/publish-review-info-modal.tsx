import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Order } from "../../interfaces/order";
import Button from "../button";

interface PublishReviewInfoModalProps {
    order: Order;
}

export default function PublishReviewInfoModal({
    order,
}: PublishReviewInfoModalProps) {
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
                <h3 className="font-bold text-lg">We value your opinion!</h3>
                <p className="py-4">
                    We hope your experience with us was great! You can now
                    publish a review for this service.
                </p>

                <div className="modal-action">
                    <Link
                        className="ml-auto w-fit"
                        to={`/prestations/${order.serviceId}`}
                        state={{ scrollToPublishReview: true }}
                    >
                        <Button className="w-fit">Publish a review</Button>
                    </Link>{" "}
                    <button className="btn">Close</button>
                </div>
            </form>
        </dialog>
    );
}
