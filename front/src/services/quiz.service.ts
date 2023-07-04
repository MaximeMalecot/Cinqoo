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

    async getQuiz(id: string) {
        return {
            _id: "12323",
            name: "Quiz 1",
            duration: 10,
            questions: 10,
        };
    }

    async getFullQuiz(id: string) {
        return {
            _id: "12323",
            name: "Quiz 1",
            duration: 10,
            questions: [],
        };
    }

    async create(name: string, duration: number) {
        return {
            _id: "12323",
        };
    }
}

export default new QuizService();
