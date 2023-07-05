import React, { createContext, useContext } from "react";
import { FullQuiz, QuestionAdmin } from "../interfaces/quiz";

interface Props {
    children: React.ReactNode;
    quiz: FullQuiz;
    reload: () => void;
}

type QuizContextType = {
    quiz: FullQuiz;
    reload: () => void;
    questions: QuestionAdmin[];
};

const QuizContext = createContext<QuizContextType>({
    quiz: {} as FullQuiz,
    reload: () => {},
    questions: [] as QuestionAdmin[],
});

export const useAdminQuizContext = () => {
    const context = useContext(QuizContext);

    if (!context) {
        throw new Error(
            "useAdminQuizContext must be used within an AuthContextProvider"
        );
    }

    return context;
};

export const AdminQuizContextProvider: React.FC<Props> = ({
    children,
    quiz,
    reload,
}) => {
    const questions = quiz.questions || [];

    return (
        <QuizContext.Provider value={{ quiz, reload, questions }}>
            {children}
        </QuizContext.Provider>
    );
};
