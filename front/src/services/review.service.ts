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

    async getAverageRateOfPrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}review/${id}/average`, {
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
            throw new Error("Failed to fetch average mark");
        }
        return await res.json();
    }

    async getCanPublish(prestationId: string) {
        const res = await fetch(
            `${API_ENDPOINT}review/${prestationId}/canPublish`,
            {
                method: "GET",
                headers: {
                    ...authHeader(),
                },
            }
        );
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch can publish boolean");
        }
        return await res.json();
    }

    async publish(prestationId: string, mark: number, comment?: string | null) {
        const res = await fetch(`${API_ENDPOINT}review/${prestationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ mark, comment }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to post mark");
        }
        return await res.json();
    }
}

export default new ReviewService();
