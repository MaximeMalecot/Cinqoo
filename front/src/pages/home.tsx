import { useState } from "react";
import HomeSearchInput from "../components/home-search-input";

const IMAGE_LINK =
    "https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1342&q=80";

export default function Home() {
    const [prestations, setPrestations] = useState([]);

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
                        <h3>Examples:</h3>
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
            <section className="py-10 px-10 flex flex-col gap-5">
                <h2 className="text-2xl font-bold">Prestations</h2>
                {prestations.length > 0 ? (
                    <div></div>
                ) : (
                    <div className="flex">
                        <p>There is no prestation found</p>
                    </div>
                )}
            </section>
        </div>
    );
}
