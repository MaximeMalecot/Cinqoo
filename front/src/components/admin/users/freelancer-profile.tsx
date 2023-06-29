import { useEffect, useState } from "react";
import { FreelancerData } from "../../../interfaces/user";
import userService from "../../../services/user.service";
import { displayMsg } from "../../../utils/toast";

interface FreelancerProfileProps {
    freelancerId: string;
}

export default function FreelancerProfile({
    freelancerId,
}: FreelancerProfileProps) {
    const [freelancer, setFreelancer] = useState<FreelancerData>();

    const fetchFreelancer = async () => {
        try {
            const res = await userService.getFreelancerProfile(freelancerId);
            console.log(res);
            setFreelancer(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchFreelancer();
    }, [freelancerId]);

    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-xl font-bold">Freelancer profile</h3>
            <div className="flex flex-col gap-2">
                <p>
                    {freelancer?.freelancerProfile?.description ??
                        "There is no description available for this freelancer"}
                </p>
            </div>
        </div>
    );
}
