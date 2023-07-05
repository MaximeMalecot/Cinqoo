import { API_ENDPOINT } from "../constants/endpoints";
import {
    CreatePrestationForm,
    PrestationFilters,
} from "../interfaces/prestation";
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

    async getRandomPrestations() {
        const res = await fetch(`${API_ENDPOINT}prestation/random`, {
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

    async adminGetPrestations() {
        const res = await fetch(`${API_ENDPOINT}prestation/admin/all`, {
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

    async searchPrestations(filters: PrestationFilters) {
        const queryFilters = Object.entries(filters).reduce(
            (acc: any, [key, value]) => {
                if (value) {
                    if (key === "categories") {
                        acc[`categories[]`] = value;
                    } else {
                        acc[key] = value;
                    }
                }
                return acc;
            },
            {} as any
        );
        const query = new URLSearchParams(queryFilters).toString();
        const res = await fetch(`${API_ENDPOINT}prestation/search?${query}`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to search prestations");
        }
        return await res.json();
    }

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

    async getUserPrestations(userId: string) {
        const res = await fetch(`${API_ENDPOINT}prestation/user/${userId}`, {
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

    async getFreelancerPrestations(userId: string) {
        const res = await fetch(
            `${API_ENDPOINT}prestation/freelancer/${userId}`,
            {
                method: "GET",
                headers: {
                    ...authHeader(),
                },
            }
        );
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
            // categories.forEach((category) => {
            //     formData.append("categories", category);
            // });
            formData.append("categories", JSON.stringify(categories));
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
            // categories.forEach((category) => {
            //     formData.append("categories", category);
            // });
            formData.append("categories", JSON.stringify(categories));
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
            throw new Error("Failed to update prestation");
        }
        return await res.json();
    }

    async updatePrestationWithoutFile(id: string, form: CreatePrestationForm) {
        const { name, description, revisionNb, delay, price, categories } =
            form;
        let data = {};
        data = {
            ...data,
            name,
            description,
            delay,
            price,
        };
        if (categories) {
            data = { ...data, categories: categories };
        }
        if (revisionNb) {
            data = { ...data, revisionNb };
        }

        const res = await fetch(`${API_ENDPOINT}prestation/${id}/nofile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify(data),
        });

        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to update prestation");
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
            throw new Error("Failed to enable prestation");
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
            throw new Error("Failed to disable prestation");
        }
        return await res.json();
    }

    async deletePrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}prestation/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
        });
        const status = res.status;

        if (status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to delete prestation");
        }
        return true;
    }
}

export default new PrestationService();
