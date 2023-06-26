import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/button";
import { useAuthContext } from "../../contexts/auth.context";
import { PrestationItemList } from "../../interfaces/prestation";
import prestationService from "../../services/prestation.service";
import { displayMsg } from "../../utils/toast";
import FavoritePart from "./favorite-part";
import FreelancerPart from "./freelancer-part";
import OrderBox from "./order-box";
import RatingPart from "./rating-part";
import Recommandations from "./recommandations";
import ReportPart from "./report-part";

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
        <div className="flex flex-col">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full md:w-2/3 flex flex-col gap-5">
                    <div className="flex gap-1">
                        <h1 className="text-4xl">{prestation.name}</h1>
                    </div>
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
                    <FavoritePart prestationId={prestation._id} />
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
                    <FreelancerPart freelancerId={prestation.owner} />
                    <div className="divider my-0"></div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Categories</h3>
                        {prestation?.categories &&
                        prestation.categories.length > 0 ? (
                            <div className="flex gap-5 flex-wrap">
                                {prestation.categories.map(
                                    (category, index) => (
                                        <Link
                                            to={
                                                "/prestations?category=" +
                                                category._id
                                            }
                                            key={index}
                                        >
                                            <Button
                                                visual="bordered-primary"
                                                key={index}
                                            >
                                                {category.name}
                                            </Button>
                                        </Link>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-sm">
                                This prestation belongs to no category
                            </p>
                        )}
                    </div>
                    <div className="divider my-0"></div>
                    <RatingPart prestationId={prestation._id} />
                    <div className="divider my-0"></div>
                </div>
                <div className="w-full md:w-1/3 h-fit flex flex-col gap-5">
                    <OrderBox prestation={prestation} />
                    <div className="w-full h-fit border flex flex-col gap-5 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full">
                        <p className="text-xs text-slate-500">
                            Once the order has been paid, you will have the
                            opportunity to discuss your request with the
                            freelancer. It is on the basis of your exchange that
                            the freelancer will be able to accept or refuse your
                            request.
                        </p>
                    </div>
                    <ReportPart prestationId={prestation._id} />
                </div>
            </section>
            <Recommandations />
        </div>
    );
}
