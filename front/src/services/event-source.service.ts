import { SSE_ENDPOINT } from "../constants/endpoints";
import { TOKEN_STORAGE_KEY } from "../constants/keys";

class EventSourceService {
    async getOrderSSE() {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) {
            throw new Error("No token found");
        }
        const eventSource = new EventSource(
            `${SSE_ENDPOINT}conversations/sse?token=${token}`
        );
        return eventSource;
    }
}

export default new EventSourceService();
