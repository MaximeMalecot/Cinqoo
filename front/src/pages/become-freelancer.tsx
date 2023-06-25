import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import { useAuthContext } from "../contexts/auth.context";
import userService from "../services/user.service";
import { displayMsg } from "../utils/toast";

const IMG =
    "https://plus.unsplash.com/premium_photo-1682434160151-004f907e2458?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

export default function BecomeFreelancer() {
    const [link, setLink] = useState("");
    const { data, isConnected } = useAuthContext();
    const isFreelancer = data?.roles.includes("FREELANCER");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const redirectToStripe = useCallback(async () => {
        try {
            setLoading(true);
            const { url } = await userService.getStripeLink();
            window.location = url;
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
            setLoading(false);
        } finally {
        }
    }, []);

    if (!isFreelancer) {
        return (
            <div className="flex flex-col w-full">
                <div
                    className="fit-content overflow-hidden w-full !bg-fixed"
                    style={{ background: `url('${IMG}')`, height: "400px" }}
                >
                    {/* <img src={IMG} alt="" className="h-100 w-100" /> */}
                </div>
                <div className="flex flex-col p-0 pt-10 md:p-10 md:p-20 gap-10">
                    <h1 className="text-2xl">Become freelancer</h1>
                    <div>
                        <p>
                            You've already completed the procedure and granted
                            the Freelancer role.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div
                className="fit-content overflow-hidden w-full !bg-fixed"
                style={{ background: `url('${IMG}')`, height: "400px" }}
            >
                {/* <img src={IMG} alt="" className="h-100 w-100" /> */}
            </div>
            <div className="flex flex-col p-0 pt-10 md:p-10 md:p-20 gap-10">
                <h1 className="text-2xl">Become freelancer</h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusantium itaque mollitia error! Nobis dolor quasi nihil
                    doloribus ratione obcaecati inventore similique, facilis
                    distinctio at minima id ducimus mollitia debitis possimus?
                </p>
                <div className="divider p-0 m-0"></div>
                {isConnected ? (
                    <>
                        <Button disabled={loading} onClick={redirectToStripe}>
                            {loading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Process Stripe procedure
                        </Button>
                    </>
                ) : (
                    <div className="flex gap-5">
                        <Link to={"/login"} className="flex-1 btn btn-primary">
                            Login
                        </Link>
                        <Link
                            to={"/register"}
                            className="flex-1 btn bg-transparent border border-primary text-primary hover:bg-primary hover:text-white hover:border-transparent"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
