import { API_ENDPOINT } from "../constants/endpoints";
import { CreatePrestationForm } from "../interfaces/prestation";
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

    async getPrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}prestation/${id}`, {
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
            throw new Error("Failed to fetch prestation");
        }

        return await res.json();
    }

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

    async createPrestation(form: CreatePrestationForm, image: File) {
        const { name, description, revisionNb, delay, price, categories } =
            form;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("delay", delay.toString());
        formData.append("price", price.toString());
        formData.append("image", image);

        if (categories) {
            categories.forEach((category) => {
                formData.append("categories", category);
            });
        }

        if (revisionNb) {
            formData.append("revisionNb", revisionNb.toString());
        }

        const res = await fetch(`${API_ENDPOINT}prestation`, {
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

    async updatePrestation(
        id: string,
        form: CreatePrestationForm,
        image?: File
    ) {
        const { name, description, revisionNb, delay, price, categories } =
            form;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("delay", delay.toString());
        formData.append("price", price.toString());

        if (image) {
            formData.append("image", image);
        }

        if (categories) {
            categories.forEach((category) => {
                formData.append("categories", category);
            });
        }

        if (revisionNb) {
            formData.append("revisionNb", revisionNb.toString());
        }

        const res = await fetch(`${API_ENDPOINT}prestation/${id}`, {
            method: "PATCH",
            headers: {
                ...authHeader(),
            },
            body: formData,
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create prestation");
        }
        return await res.json();
    }

    async enablePrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}prestation/enable/${id}`, {
            method: "PATCH",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create prestation");
        }
        return await res.json();
    }

    async disablePrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}prestation/disable/${id}`, {
            method: "PATCH",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create prestation");
        }
        return await res.json();
    }
}

export default new PrestationService();
