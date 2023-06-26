import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import { PrestationItemList } from "../../interfaces/prestation";
import prestationService from "../../services/prestation.service";
import { displayMsg } from "../../utils/toast";
import OrderBox from "./order-box";

export default function Prestation() {
    const { isConnected } = useAuthContext();

    const { id } = useParams();
    const [prestation, setPrestation] = useState<PrestationItemList | null>(
        null
    );

    const fetchPrestation = useCallback(async () => {
        try {
            if (!id) throw new Error("No id provided");
            const res = await prestationService.getPrestation(id);
            setPrestation(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [id]);

    useEffect(() => {
        fetchPrestation();
    }, []);

    if (!prestation)
        return (
            <div className="flex flex-col">
                <div className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col gap-5">
                    Loading...
                </div>
            </div>
        );

    return (
        <div className="flex md:flex-col">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full md:w-2/3 flex flex-col gap-5">
                    <h1 className="text-4xl">{prestation.name}</h1>
                    <div
                        className="duration-700 bg-slate-200 hover:bg-slate-300 rounded-md p-5 overflow-hidden w-full"
                        style={{
                            maxHeight: "440px",
                            height: "440px",
                        }}
                    >
                        <img
                            src={prestation.image}
                            alt="Your prestation image"
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <div className="divider my-0"></div>
                    <div>
                        <h3 className="text-xl font-bold">
                            About this prestation
                        </h3>
                        <p>
                            {prestation.description.length > 0
                                ? prestation.description
                                : "This prestation has no description"}
                        </p>
                    </div>
                    <div className="divider my-0"></div>
                    <div>
                        <h3 className="text-xl font-bold">
                            About the freelancer
                        </h3>
                        <p>{prestation.owner}</p>
                    </div>
                    <div className="divider my-0"></div>
                    <div>
                        <h3 className="text-xl font-bold">Rating</h3>
                    </div>
                </div>
                <OrderBox prestation={prestation} />
            </section>
        </div>
    );
}
