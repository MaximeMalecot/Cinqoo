import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class ReportService {
    async getReasons() {
        const res = await fetch(`${API_ENDPOINT}report/reason/all`, {
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
            throw new Error("Failed to fetch report reasons");
        }

        return await res.json();
    }

    async reportEntity(
        target: string,
        reportReason: string,
        description: string
    ) {
        const res = await fetch(`${API_ENDPOINT}report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ target, reportReason, description }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed report entity");
        }
        return await res.json();
    }
}

export default new ReportService();
