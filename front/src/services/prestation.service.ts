import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class PrestationService {
    async getPrestations() {
        const res = await fetch(`${API_ENDPOINT}prestation`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch prestations");
        }

        return await res.json();
    }

    async getPrestation(id: string) {}

    async searchPrestation() {}

    async getSelfPrestations() {
        const res = await fetch(`${API_ENDPOINT}prestation/self`, {
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
            throw new Error("Failed to fetch prestations");
        }

        return await res.json();
    }

    async createPrestation() {
        const formData = new FormData();

        const res = await fetch(`${API_ENDPOINT}prestation`, {
            method: "POST",
            headers: {
                ...authHeader(),
            },
            body: formData,
        });
        if (res.status !== 200) return false;
        return await res.json();
    }

    async updatePrestation() {}
}

export default new PrestationService();
