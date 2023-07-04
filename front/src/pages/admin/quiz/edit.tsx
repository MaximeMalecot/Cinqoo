import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../../../components/admin/quiz/question-form";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { TextArea } from "../../../components/text-area";
import {
    AdminQuizContextProvider,
    useAdminQuizContext,
} from "../../../contexts/admin-quiz.context";
import { FullQuiz } from "../../../interfaces/quiz";
import quizService from "../../../services/quiz.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminEditQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<FullQuiz | null>(null);
    const { reload } = useAdminQuizContext();

    const fetchQuiz = async () => {
        try {
            if (!id) throw new Error("Id is not defined");
            const res = await quizService.getFullQuiz(id);
            setQuiz(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    const addQuestion = async (question: any) => {
        try {
            console.log("Edit receive question to add");
            console.log(question);
            // await quizService.createQuestion(question);
            // setQuestions([...questions, question]);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const editQuestion = async (question: any) => {
        try {
            // await quizService.editQuestion(question);
            // setQuestions([...questions, question]);
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
        <div className="overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl">Edit quiz</h1>
            </div>
            <div className="flex flex-col gap-3">
                {quiz && (
                    <AdminQuizContextProvider quiz={quiz} reload={fetchQuiz}>
                        <section id="quiz-part" className="flex flex-col gap-3">
                            <EditQuizDataForm />
                        </section>
                        <section
                            id="questions-part"
                            className="flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl">Questions</h3>
                            </div>
                            {quiz?.questions.length === 0 && (
                                <p className="text-xs text-slate-400">
                                    There is no question yet
                                </p>
                            )}
                            {quiz && quiz?.questions.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    {quiz.questions.map((question, index) => (
                                        <QuestionForm
                                            type="edit"
                                            submitAction={editQuestion}
                                            initData={question}
                                            key={index}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="border border-2 p-2 flex flex-col gap-3 rounded-md">
                                <QuestionForm
                                    type="create"
                                    submitAction={addQuestion}
                                />
                            </div>
                        </section>
                    </AdminQuizContextProvider>
                )}
            </div>
        </div>
    );
}

function EditQuizDataForm() {
    const { quiz } = useAdminQuizContext();
    const { register: registerField, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const submitForm = async (data: any) => {
        try {
            const res = await quizService.create(data.name, data.duration);
            navigate(`/admin/quiz/${res._id}`);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            className="flex flex-col gap-3"
        >
            <Input
                placeholder="Name"
                register={registerField("name", {
                    value: quiz.name,
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

            <TextArea
                placeholder="Description"
                register={registerField("description", {
                    value: quiz?.description,
                })}
            />

            <Button type="submit">Apply</Button>
        </form>
    );
}
