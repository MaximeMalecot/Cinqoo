import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button";
import { useAuthContext } from "../../contexts/auth.context";
import { PrestationItemList } from "../../interfaces/prestation";
import paymentService from "../../services/payment.service";

interface OrderBoxProps {
    prestation: PrestationItemList;
}

export default function OrderBox({ prestation }: OrderBoxProps) {
    const { isConnected } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const processToPayment = useCallback(async () => {
        try {
            setLoading(true);
            const { url } = await paymentService.createPaymentLink(
                prestation._id
            );
            window.location.href = url;
        } catch (e: any) {
            console.error(e.message);
            setLoading(false);
        } finally {
        }
    }, [prestation, isConnected]);

    return (
        <div className="w-full md:w-1/3 h-fit border flex flex-col gap-5 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full">
            <h1 className="text-xl">Order this prestation</h1>
            <div className="flex flex-col">
                <div className="flex justify-between">
                    <p>Delay:</p>
                    <p>{prestation.delay} days</p>
                </div>
                <div className="flex justify-between">
                    <p>Revisions included:</p>
                    <p>{prestation.revisionNb}</p>
                </div>
                <div className="text-xl font-bold flex justify-between">
                    <p>Total price:</p>
                    <p>{prestation.price} $</p>
                </div>
            </div>
            {isConnected ? (
                <Button
                    disabled={loading}
                    onClick={processToPayment}
                    className="flex-1 w-full"
                    visual="bordered-primary"
                >
                    {loading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Fast order{" "}
                    {!loading && (
                        <svg
                            width="15"
                            height="10"
                            viewBox="0 0 15 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.999 9L14 5M14 5L9.999 1M14 5L1 5"
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    )}
                </Button>
            ) : (
                <Link to="/login">
                    <Button className="flex-1 w-full" visual="bordered-primary">
                        Login first{" "}
                        <svg
                            width="15"
                            height="10"
                            viewBox="0 0 15 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.999 9L14 5M14 5L9.999 1M14 5L1 5"
                                stroke="black"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Button>
                </Link>
            )}
        </div>
    );
}
