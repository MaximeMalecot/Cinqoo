import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuizListItem } from "../../../../interfaces/quiz";
import quizService from "../../../../services/quiz.service";
import { displayMsg } from "../../../../utils/toast";

export default function PreQuiz() {
    const [_, setQuiz] = useState<QuizListItem | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchQuiz = async () => {
        try {
            if (!id) throw new Error("Id is not defined");
            const res = await quizService.getQuiz(id);
            if (res?._id) {
                setQuiz(res);
            } else {
                throw new Error("Quiz not found");
            }
        } catch (e: any) {
            displayMsg(e.message, "error");
            navigate("/account/skills-assessments");
        }
    };

    useEffect(() => {
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                    <h1 className="text-xl">
                        Assess your skills and obtain badges to prove it.
                    </h1>
                    <p className="text-slate-500">
                        Check your skill level. Answer several multiple-choice
                        questions, get more than 50% right, and earn a badge of
                        competence.
                    </p>
                </div>
            </div>
        </div>
    );
}
