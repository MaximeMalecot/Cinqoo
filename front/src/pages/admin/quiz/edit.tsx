import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../../../components/admin/quiz/question-form";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { FullQuiz } from "../../../interfaces/quiz";
import quizService from "../../../services/quiz.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminEditQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<FullQuiz | null>(null);
    const navigate = useNavigate();
    const { register: registerField, handleSubmit, reset } = useForm();

    const fetchQuiz = async () => {
        try {
            if (!id) throw new Error("Id is not defined");
            const res = await quizService.getFullQuiz(id);
            setQuiz(res);
            reset();
        } catch (e: any) {
            displayMsg(e.message, "error");
        } finally {
            reset();
        }
    };

    const submitForm = async (data: any) => {
        try {
            const res = await quizService.create(data.name, data.duration);
            navigate(`/admin/quiz/${res._id}`);
        } catch (e: any) {
            console.log(e.message);
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
                <h1 className="text-2xl">Edit quiz</h1>
            </div>
            <div className="flex flex-col gap-3">
                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="flex flex-col gap-3"
                >
                    <Input
                        placeholder="Name"
                        register={registerField("name", {
                            value: quiz?.name,
                        })}
                    />
                    <Input
                        placeholder="Duration (in minutes)"
                        type="number"
                        step="0.1"
                        register={registerField("duration", {
                            value: quiz?.duration,
                        })}
                    />
                    <div className="border border-2 p-2 flex flex-col gap-3 rounded-md">
                        <h3 className="text-xl text-slate-500">Questions</h3>
                        {quiz?.questions.length === 0 && (
                            <p className="text-xs text-slate-400">
                                There is no question yet
                            </p>
                        )}
                        <QuestionForm type="create" />
                    </div>
                    <Button type="submit">Apply</Button>
                </form>
            </div>
        </div>
    );
}
