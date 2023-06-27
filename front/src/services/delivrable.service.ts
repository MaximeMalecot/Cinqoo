import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class DeliverableService {
    async getDeliverables(orderId: string) {
        const res = await fetch(`${API_ENDPOINT}deliverable/${orderId}`, {
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
            throw new Error("Failed to fetch deliverables");
        }

        return await res.json();
    }

    async publishDeliverable(orderId: string, name: string, file: File) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);

        const res = await fetch(`${API_ENDPOINT}deliverable/${orderId}`, {
            method: "POST",
            headers: {
                ...authHeader(),
            },
            body: formData,
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create prestation");
        }
        return await res.json();
    }
}

export default new DeliverableService();
