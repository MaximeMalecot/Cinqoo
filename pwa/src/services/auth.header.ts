import { TOKEN_STORAGE_KEY } from "../constants/keys";

export default function authHeader() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        return { Authorization: "Bearer " + token };
    }
}
