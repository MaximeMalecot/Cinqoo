import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class RequestService {
    async getAllRequests() {
        const res = await fetch(`${API_ENDPOINT}order/request/all`, {
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
            throw new Error("Failed to fetch requests");
        }

        return await res.json();
    }

    async getPendingRequests() {
        const res = await fetch(`${API_ENDPOINT}order/request/pending`, {
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
            throw new Error("Failed to fetch requests");
        }

        return await res.json();
    }

    async getRequest(id: string) {
        const res = await fetch(`${API_ENDPOINT}order/${id}`, {
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
            throw new Error("Failed to fetch order");
        }

        return await res.json();
    }
}

export default new RequestService();
