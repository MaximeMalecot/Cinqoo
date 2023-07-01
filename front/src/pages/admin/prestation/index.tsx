import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PrestationBills from "../../../components/admin/bills/prestation-bills";
import PrestationOrders from "../../../components/admin/orders/prestation-orders";
import PrestationReports from "../../../components/admin/reports/prestation-reports";
import PrestationReviews from "../../../components/admin/reviews/prestation-reviews";
import Button from "../../../components/button";
import { Category } from "../../../interfaces/category";
import { PrestationItemList } from "../../../interfaces/prestation";
import prestationService from "../../../services/prestation.service";
import { displayMsg } from "../../../utils/toast";
import AdminFreelancerPart from "./freelancer-part";

export default function AdminPrestation() {
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
        <div className="flex flex-col w-full overflow-hidden">
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col md:flex-row gap-5 relative">
                <div className="w-full flex flex-col gap-5">
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
                    <AdminFreelancerPart userId={prestation.owner} />
                    <div className="divider my-0"></div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Categories</h3>
                        {prestation?.categories &&
                        prestation.categories.length > 0 ? (
                            <div className="flex gap-5 flex-wrap">
                                {prestation.categories.map(
                                    (category: Category, index: number) => (
                                        <Link
                                            to={
                                                "/admin/categories/" +
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
                    <div className="flex ">
                        <PrestationOrders prestationId={prestation._id} />
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex">
                        <PrestationBills prestationId={prestation._id} />
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex ">
                        <PrestationReports prestationId={prestation._id} />
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex ">
                        <PrestationReviews prestationId={prestation._id} />
                    </div>
                </div>
            </section>
        </div>
    );
}
