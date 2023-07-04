import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button";
import { QuizListItem } from "../../../interfaces/quiz";
import quizService from "../../../services/quiz.service";
import { displayMsg } from "../../../utils/toast";

export default function QuizzesPart() {
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);

    const fetchQuizzes = async () => {
        try {
            const res = await quizService.getAllQuiz();
            console.log(res);
            setQuizzes(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    if (quizzes.length === 0) return <p>There is no quiz</p>;

    return (
        <div className="border-2 rounded rounded-md overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Questions</th>
                        <th>Duration (minutes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz, index) => (
                        <tr key={index} className="bg-base-200">
                            <td>{quiz.name}</td>
                            <td>{quiz.totalQuestions}</td>
                            <td>{quiz.duration} minute(s)</td>
                            <td>
                                <Link
                                    to={`/account/evaluate-skills/${quiz._id}`}
                                >
                                    <Button>See</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
