import { QuestionAdmin } from "../interfaces/quiz";

class QuizService {
    async getAllQuiz() {
        return [
            {
                _id: "12323",
                name: "Quiz 1",
                duration: 10,
                questions: 10,
            },
        ];
    }

    async getQuiz(_: string) {
        return {
            _id: "12323",
            name: "Quiz 1",
            duration: 10,
            questions: 10,
        };
    }

    async getFullQuiz(_: string) {
        return {
            _id: "12323",
            name: "Quiz 1",
            duration: 10,
            questions: [],
        };
    }

    async create(_: string, __: number) {
        return {
            _id: "12323",
        };
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
