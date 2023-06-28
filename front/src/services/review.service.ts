import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class ReviewService {
    async getReviewsByPrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}review/${id}`, {
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
            throw new Error("Failed to fetch reviews");
        }
        return await res.json();
    }
}

export default new ReviewService();
