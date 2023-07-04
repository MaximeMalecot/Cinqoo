export interface QuizListItem {
    _id: string;
    name: string;
    questions: number;
    duration: number;
}

export interface FullQuiz {
    _id: string;
    name: string;
    duration: number;
    questions: Question[];
}

export interface Question {
    id: string;
    label: string;
    answers: Answer[];
}

export interface Answer {
    id: string;
    label: string;
    isCorrect: boolean;
}
