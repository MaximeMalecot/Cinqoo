import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FullQuiz } from "../../../interfaces/quiz";
import quizService from "../../../services/quiz.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<FullQuiz | null>(null);
    const navigate = useNavigate();

    const fetchQuiz = async () => {
        try {
            if (!id) throw new Error("Id is not defined");
            const res = await quizService.getFullQuiz(id);
            console.log(res);
            setQuiz(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    return (
        <div className=" overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl">Quiz</h1>
            </div>
        </div>
    );
}
