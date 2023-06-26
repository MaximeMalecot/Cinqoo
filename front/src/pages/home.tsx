import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/button";
import HomeSearchInput from "../components/home-search-input";
import ViewPrestationCard from "../components/prestation/prestation-card/view-prestation-card";
import { Category } from "../interfaces/category";
import categoryService from "../services/category.service";
import prestationService from "../services/prestation.service";
import { displayMsg } from "../utils/toast";

const IMAGE_LINK =
    "https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1342&q=80";

export default function Home() {
    const [prestations, setPrestations] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            setCategories(res);
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        }
    };

    const fetchPrestations = async () => {
        try {
            setLoading(true);
            const res = await prestationService.getPrestations();
            setPrestations(res);
        } catch (e: any) {
            console.log(e);
            displayMsg(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrestations();
        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col">
            <section className="h-4/6 bg-primary py-40">
                <div className="container mx-auto flex flex-col gap-3 p-10 md:p-5 md:flex-row md:items-center justify-between">
                    <div className="flex flex-col gap-5 text-white p-2 md:p-0">
                        <div className="flex flex-col text-2xl md:text-5xl font-bold">
                            <h1 className="">Find the right freelance</h1>
                            <h1>service, right away</h1>
                        </div>
                        <HomeSearchInput />
                        {categories.length > 0 && (
                            <div>
                                <h3>Examples:</h3>
                                <div className="flex gap-2">
                                    {categories.slice(0, 5).map((c, index) => (
                                        <Link
                                            to={`/prestations?category=${c._id}`}
                                            key={index}
                                            className="cursor-pointer border border-1 border-white w-fit px-2 rounded-md hover:bg-white hover:text-primary duration-500"
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="bg-primary w-full h-70 md:w-80 md:h-80 rounded rounded-md overflow-hidden"
                        // style={{ height: "260px", width: "260px" }}
                    >
                        <img
                            src={IMAGE_LINK}
                            className="object-cover	 w-full h-full"
                        />
                    </div>
                </div>
            </section>
            <section className="container mx-auto my-0 md:my-5 p-5 md:p-0 py-10 flex flex-col gap-5">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Prestations</h2>
                    <Link to={"/prestations"}>
                        <Button visual="primary">See all</Button>
                    </Link>
                </div>
                {prestations.length > 0 ? (
                    <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {prestations.map((p, index) => (
                            <ViewPrestationCard prestation={p} key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="flex">
                        <p>There is no prestation found</p>
                    </div>
                )}
            </section>
        </div>
    );
}
