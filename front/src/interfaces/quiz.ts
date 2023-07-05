export interface QuizListItem {
    _id: string;
    name: string;
    questions: number;
    duration: number;
    totalQuestions?: number;
}

export interface FullQuiz {
    _id: string;
    name: string;
    duration: number;
    questions: QuestionAdmin[];
    description?: string;
    totalQuestions?: number;
}

export interface QuizData {
    _id: string;
    name: string;
    duration: number;
    description?: string;
    totalQuestions?: number;
}

export interface Question {
    _id: string;
    label: string;
    answers: Answer[];
}

export interface QuestionAdmin {
    _id: string;
    label: string;
    answers: AnswerAdmin[];
}

export interface Answer {
    _id?: string;
    label: string;
    isRight?: boolean;
}

export interface AnswerAdmin extends Answer {
    isRight: boolean;
}

export interface ResultData {
    _id: string;
    userId: string;
    quizId: string;
    success: boolean;
    score: number;
    attemptedAt: Date;
    quiz: QuizData;
}
