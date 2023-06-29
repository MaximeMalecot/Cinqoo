import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FreelancerData } from "../../interfaces/user";
import userService from "../../services/user.service";

interface FreelancerPartProps {
    freelancerId: string;
}

const IMG =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80";
export default function FreelancerPart({ freelancerId }: FreelancerPartProps) {
    const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);

    const fetchFreelancer = useCallback(async () => {
        try {
            const res = await userService.getFreelancerProfile(freelancerId);
            setFreelancer(res);
        } catch (e: any) {
            console.log(e.message);
        }
    }, [freelancerId]);

    useEffect(() => {
        fetchFreelancer();
    }, [freelancerId]);

    if (!freelancer) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold">About the freelancer</h3>
            <div className="flex gap-5">
                <div className="avatar">
                    <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={IMG} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <Link
                        to={`/freelancer/${freelancer._id}`}
                        className="capitalize text-md hover:underline w-fit"
                    >
                        {freelancer.username}
                    </Link>
                    <div>
                        <span className="text-sm text-gray-500">
                            {freelancer.freelancerProfile.description ? (
                                <>{freelancer.freelancerProfile.description}</>
                            ) : (
                                <>No description</>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
