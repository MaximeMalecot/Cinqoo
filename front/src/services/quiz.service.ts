import { API_ENDPOINT } from "../constants/endpoints";
import { QuestionAdmin } from "../interfaces/quiz";
import authHeader from "./auth.header";

class QuizService {
    async getAllQuiz() {
        const res = await fetch(`${API_ENDPOINT}quiz`, {
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
            throw new Error("Failed to fetch quizzes");
        }

        return await res.json();
    }

    async getQuiz(id: string) {
        const res = await fetch(`${API_ENDPOINT}quiz/${id}`, {
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
            throw new Error("Failed to fetch quiz");
        }

        return await res.json();
    }

    async getFullQuiz(_: string) {
        const res = await fetch(`${API_ENDPOINT}quiz`, {
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
            throw new Error("Failed to fetch quizzes");
        }

        return await res.json();
    }

    async create(name: string, duration: number, description?: string) {
        const res = await fetch(`${API_ENDPOINT}quiz`, {
            method: "POST",
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                duration,
                description,
            }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create quiz");
        }
        return await res.json();
    }

    // QUESTIONS

    async createQuestion(_: QuestionAdmin) {
        return {
            _id: "12323",
        };
    }

    async updateQuestion(_: string, __: string) {}
}

export default new QuizService();
