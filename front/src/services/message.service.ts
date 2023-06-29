import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class MessageService {
    async getMessages(orderId: string) {
        const res = await fetch(`${API_ENDPOINT}message/${orderId}`, {
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
            throw new Error("Failed to fetch messages");
        }

        return await res.json();
    }

    async sendMessage(orderId: string, content: string) {
        const res = await fetch(`${API_ENDPOINT}message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({
                orderId,
                content,
            }),
        });

        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to send message");
        }

        return await res.json();
    }
}

export default new MessageService();
