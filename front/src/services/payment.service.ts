import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class PaymentService {
    async getBills() {
        const res = await fetch(`${API_ENDPOINT}payment/history/self`, {
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

    async createPaymentLink(prestationId: string) {
        const res = await fetch(`${API_ENDPOINT}payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ serviceId: prestationId }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to generate payment link");
        }
        return await res.json();
    }
}

export default new PaymentService();
