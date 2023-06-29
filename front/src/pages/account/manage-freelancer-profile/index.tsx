import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { TextArea } from "../../../components/text-area";
import { useAuthContext } from "../../../contexts/auth.context";
import { FreelancerData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg, notify } from "../../../utils/toast";

export default function ManageFreelancerProfile() {
    const [profile, setProfile] = useState<FreelancerData | null>(null);
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { data } = useAuthContext();

    const redirectToStripe = async () => {
        try {
            setLoading(true);
            const { url } = await userService.getStripeLink();
            window.location = url;
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await userService.getFreelancerProfile(data?._id!);
            setProfile(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
            navigate("/account/settings");
        }
    };

    const updateProfile = async (data: any) => {
        try {
            setLoading(true);
            const res = await userService.updateFreelancerProfile(
                data.description
            );
            notify("Profile updated");
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <section className="flex flex-col gap-3 w-full">
                <h2 className="text-2xl">Manage your Freelancer Profile</h2>
                <form
                    onSubmit={handleSubmit(updateProfile)}
                    className="flex flex-col gap-5 py-0"
                >
                    <div className="w-full">
                        <Input
                            className="w-full bg-slate-300 cursor-not-allowed"
                            placeholder="Username"
                            value={data?.username}
                            disabled
                        />
                        <p className="text-md">
                            You can edit your username in{" "}
                            <Link
                                to={"/account/settings"}
                                className="underline"
                            >
                                account settings
                            </Link>
                        </p>
                    </div>
                    <TextArea
                        placeholder="Description"
                        register={registerField("description", {
                            required: true,
                            value: profile?.freelancerProfile.description,
                            maxLength: {
                                value: 255,
                                message: "Max length is 255 characters",
                            },
                        })}
                    />
                    {errors.description?.message && (
                        <p>{errors.description?.message as string}</p>
                    )}
                    <div className="w-full flex flex-col gap-5">
                        <Button
                            disabled={loading}
                            visual="primary"
                            type="submit"
                            className="flex-1"
                        >
                            {loading && (
                                <span className="loading loading-spinner"></span>
                            )}{" "}
                            Save
                        </Button>
                    </div>
                </form>
            </section>
            <div className="divider m-y-5"></div>
            <section className="flex flex-col gap-3 w-full">
                <h2 className="text-2xl">Manage your Freelancer Profile</h2>
                <p>
                    Manage your Stripe Connected Account. You can see your
                    balance from there.
                </p>
                <Button
                    disabled={loading}
                    visual="bordered-primary"
                    type="button"
                    onClick={redirectToStripe}
                    className="flex-1"
                >
                    {loading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Go to Stripe
                </Button>
            </section>
        </div>
    );
}
