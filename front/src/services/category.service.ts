import { API_ENDPOINT } from "../constants/endpoints";

class CategoryService {
    async getCategories() {
        const res = await fetch(`${API_ENDPOINT}category/all`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch categories");
        }

        return await res.json();
    }
}

export default new CategoryService();
