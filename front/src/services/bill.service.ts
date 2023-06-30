import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class BillService {
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

    async getBill(id: string) {
        const res = await fetch(`${API_ENDPOINT}payment/bill/${id}`, {
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
            throw new Error("Failed to fetch bill");
        }

        return await res.json();
    }

    async getBillsByPrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}payment/prestation/${id}`, {
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

    async getBillsByUser(id: string) {
        const res = await fetch(`${API_ENDPOINT}payment/user/${id}`, {
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

    async refundBill(id: string) {
        const res = await fetch(`${API_ENDPOINT}payment/refund/${id}`, {
            method: "POST",
            headers: {
                ...authHeader(),
            },
        });

        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to refund order");
        }

        return await res.json();
    }
}

export default new BillService();
