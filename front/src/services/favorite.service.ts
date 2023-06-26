import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class FavoriteService {
    async getFavorites() {
        const res = await fetch(`${API_ENDPOINT}favorite`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch bills");
        }

        return await res.json();
    }

    async toggleFavorite(prestationId: string) {
        const res = await fetch(`${API_ENDPOINT}favorite/${prestationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to generate payment link");
        }
        return await res.json();
    }
}

export default new FavoriteService();
