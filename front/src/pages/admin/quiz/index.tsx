import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { QuizListItem } from "../../../interfaces/quiz";
import quizService from "../../../services/quiz.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminQuiz() {
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
    const navigate = useNavigate();

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

    return (
        <div className=" overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl">Quiz</h1>
                <Link to="/admin/quiz/create">
                    <Button>New</Button>
                </Link>
            </div>
            {quizzes.length === 0 && <p>There is no quiz</p>}
            {quizzes.length > 0 && (
                <div className="border-2 rounded rounded-md overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Questions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz, index) => (
                                <tr key={index} className="bg-base-200">
                                    <td>{quiz._id}</td>
                                    <td>{quiz.name}</td>
                                    <td>{quiz.questions}</td>
                                    <td>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/quiz/${quiz._id}`
                                                )
                                            }
                                        >
                                            See
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
