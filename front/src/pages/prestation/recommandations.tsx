import { useState } from "react";
import { PrestationItemList } from "../../interfaces/prestation";

export default function Recommandations() {
    const [prestations, setPrestations] = useState<PrestationItemList[]>([]);

    return (
        <section className="p-10 bg-slate-200">
            <div className="container mx-auto flex flex-col md:flex-row gap-5 relative">
                <h3 className="text-xl">You may also like</h3>
            </div>
        </section>
    );
}
