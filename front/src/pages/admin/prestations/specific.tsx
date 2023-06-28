import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../components/button";
import { BillsItemList } from "../../../interfaces/bill";
import { Category } from "../../../interfaces/category";
import { Order } from "../../../interfaces/order";
import { PrestationItemList } from "../../../interfaces/prestation";
import { Report } from "../../../interfaces/report";
import { Review } from "../../../interfaces/review";
import billService from "../../../services/bill.service";
import orderService from "../../../services/order.service";
import prestationService from "../../../services/prestation.service";
import reportService from "../../../services/report.service";
import reviewService from "../../../services/review.service";
import { displayMsg } from "../../../utils/toast";
import FreelancerPart from "../../prestation/freelancer-part";

export default function AdminPrestation() {
    const { id } = useParams();
    const [prestation, setPrestation] = useState<PrestationItemList | null>(
        null
    );
    const [orders, setOrders] = useState<Order[]>([]);
    const [bills, setBills] = useState<BillsItemList[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reports, setReports] = useState<Report[]>([]);

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

    const fetchOrders = useCallback(async () => {
        try {
            if (!prestation) return;
            const res = await orderService.getOrdersByPrestation(
                prestation._id
            );
            console.log("orders", res);
            setOrders(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [prestation]);

    const fetchBills = useCallback(async () => {
        try {
            if (!prestation) return;
            const res = await billService.getBillsByPrestation(prestation._id);
            console.log("bills", res);
            setBills(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [prestation]);

    const fetchReviews = useCallback(async () => {
        try {
            if (!prestation) return;
            const res = await reviewService.getReviewsByPrestation(
                prestation._id
            );
            console.log("reviews", res);
            setReviews(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [prestation]);

    const fetchReports = useCallback(async () => {
        try {
            if (!prestation) return;
            const res = await reportService.getReportsForPrestation(
                prestation._id
            );
            console.log("reports", res);
            setReports(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [prestation]);

    useEffect(() => {
        fetchPrestation();
    }, []);

    useEffect(() => {
        fetchOrders();
        fetchBills();
        fetchReviews();
        fetchReports();
    }, [prestation]);

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
                        <h3 className="text-xl font-bold">Orders</h3>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex">
                        <h3 className="text-xl font-bold">Bills</h3>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex ">
                        <h3 className="text-xl font-bold">Reviews</h3>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex ">
                        <h3 className="text-xl font-bold">Reports</h3>
                    </div>
                </div>
            </section>
        </div>
    );
}
