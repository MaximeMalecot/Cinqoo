import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/button";
import ViewPrestationCard from "../components/prestation/prestation-card/view-prestation-card";
import { PrestationItemList } from "../interfaces/prestation";
import { FreelancerData } from "../interfaces/user";
import prestationService from "../services/prestation.service";
import userService from "../services/user.service";
import { displayMsg } from "../utils/toast";

const IMG =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80";

export default function Freelancer() {
    const { id } = useParams<{ id: string }>();
    const [freelancer, setFreelancer] = useState<FreelancerData | null>(null);
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);

    const fetchPrestations = async () => {
        try {
            if (!id) throw new Error("No id");
            const res = await prestationService.getUserPrestations(id);
            setPrestations(res);
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        }
    };

    const fetchFreelancer = useCallback(async () => {
        try {
            if (!id) throw new Error("No id");
            const res = await userService.getFreelancerProfile(id);
            setFreelancer(res);
        } catch (e: any) {
            console.log(e.message);
        }
    }, [id]);

    useEffect(() => {
        fetchFreelancer();
        fetchPrestations();
    }, [id]);

    if (!freelancer) return <div>Loading...</div>;

    return (
        <div className="flex flex-col">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full md:w-1/3 h-fit flex flex-col gap-5">
                    <div className="w-full h-fit border flex flex-col gap-5 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full items-center">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={IMG} />
                            </div>
                        </div>
                        <h3 className="text-2xl">{freelancer.username}</h3>
                        <div className="divider py-0 my-0"></div>
                        <Button className="w-full">Contact me</Button>
                    </div>

                    <div className="w-full h-fit border flex flex-col gap-5 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full ">
                        <h3 className="font-bold">Description</h3>
                        <p>
                            {freelancer.freelancerProfile.description
                                ? freelancer.freelancerProfile.description
                                : "I have no description yet"}
                        </p>
                    </div>
                    <Button visual="danger" className="w-full">
                        Report
                    </Button>
                </div>
                <div className="w-full md:w-2/3 flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-xl font-bold">
                            Prestations of {freelancer.username}
                        </h1>

                        {prestations.length > 0 ? (
                            <div className="flex flex-col items-center gap-5 lg:grid lg:grid-cols-2">
                                {prestations.map((p, index) => (
                                    <ViewPrestationCard
                                        prestation={p}
                                        key={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p>I have no prestation available</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
