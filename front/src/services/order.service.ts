import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class ReportService {
    async getOrders() {
        const res = await fetch(`${API_ENDPOINT}order/self`, {
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
            throw new Error("Failed to fetch orders");
        }

        return await res.json();
    }

    async getOrder(id: string) {
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

export default new ReportService();
