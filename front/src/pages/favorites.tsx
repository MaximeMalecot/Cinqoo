import { useEffect, useState } from "react";
import ViewPrestationCard from "../components/prestation/prestation-card/view-prestation-card";
import { Favorite } from "../interfaces/favorite";
import favoriteService from "../services/favorite.service";
import { displayMsg } from "../utils/toast";

export default function Favorites() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    const fetchFavorites = async () => {
        try {
            const res = await favoriteService.getFavorites();
            setFavorites(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div>
                    <h1 className="text-2xl">Favorites</h1>
                </div>
            </div>
            {favorites.length === 0 ? (
                <div>
                    <p>You have saved no prestation yet</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5 items-center md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favorites.map((f, index) => (
                        <ViewPrestationCard
                            prestation={f.prestation}
                            key={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
