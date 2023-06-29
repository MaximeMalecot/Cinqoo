import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class RequestService {
    async getAllRequests() {
        const res = await fetch(`${API_ENDPOINT}order/request/all`, {
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
            throw new Error("Failed to fetch requests");
        }

        return await res.json();
    }

    async getPendingRequests() {
        const res = await fetch(`${API_ENDPOINT}order/request/pending`, {
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
            throw new Error("Failed to fetch requests");
        }

        return await res.json();
    }

    async getRequest(id: string) {
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

    async acceptRequest(id: string) {
        const res = await fetch(`${API_ENDPOINT}order/request/${id}/accept`, {
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
            throw new Error("Failed to accept request");
        }
        return await res.json();
    }

    async refuseRequest(id: string) {
        const res = await fetch(`${API_ENDPOINT}order/request/${id}/refuse`, {
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
            throw new Error("Failed to refuse request");
        }
        return await res.json();
    }

    async terminateRequest(id: string) {
        const res = await fetch(
            `${API_ENDPOINT}order/request/${id}/terminate`,
            {
                method: "PATCH",
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
            throw new Error("Failed to terminate request");
        }
        return await res.json();
    }

    async confirmFinalizationRequest(id: string) {
        const res = await fetch(
            `${API_ENDPOINT}order/request/${id}/confirm-finalization`,
            {
                method: "PATCH",
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
            throw new Error("Failed to finalize order");
        }
        return await res.json();
    }

    async startRevision(id: string) {
        const res = await fetch(
            `${API_ENDPOINT}order/request/${id}/ask-for-revision`,
            {
                method: "PATCH",
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
            throw new Error("Failed to start revision");
        }
        return await res.json();
    }
}

export default new RequestService();
