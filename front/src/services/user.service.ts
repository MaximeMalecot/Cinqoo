import { API_ENDPOINT } from "../constants/endpoints";
import authHeader from "./auth.header";

class UserService {
    async getSelf() {
        const res = await fetch(`${API_ENDPOINT}user/self`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) return false;
        return await res.json();
    }

    async getUsers() {
        const res = await fetch(`${API_ENDPOINT}user`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        return await res.json();
    }

    async getUser(id: string) {
        const res = await fetch(`${API_ENDPOINT}user/${id}`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        return await res.json();
    }

    async getStripeLink() {
        const res = await fetch(`${API_ENDPOINT}user/self/become-freelancer`, {
            method: "POST",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to login");
        }

        return await res.json();
    }

    async updatePassword(
        userId: string,
        oldPassword: string,
        password: string
    ): Promise<boolean> {
        const res = await fetch(`${API_ENDPOINT}user/pwd/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({
                oldPassword,
                password,
            }),
        });
        const status = res.status;
        if (status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to update password");
        }
        return true;
    }

    async updateUser(
        userId: string,
        { email, username }: { email?: string; username?: string }
    ): Promise<boolean> {
        const res = await fetch(`${API_ENDPOINT}user/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({
                email,
                username,
            }),
        });
        const status = res.status;
        if (status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to update account");
        }
        return true;
    }

    async deleteAccount(id: string) {
        const res = await fetch(`${API_ENDPOINT}user/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
        });
        const status = res.status;

        if (status !== 204) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to delete account");
        }
        return true;
    }
}

export default new UserService();
