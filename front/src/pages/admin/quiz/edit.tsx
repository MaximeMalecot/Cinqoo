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
import { displayMsg, notify } from "../../../utils/toast";
import PromptDeleteModal from "./prompt-delete-modal";

export default function AdminEditQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<FullQuiz | null>(null);
    const navigate = useNavigate();

    const fetchQuiz = async () => {
        try {
            if (!id) throw new Error("Id is not defined");
            const res = await quizService.getFullQuiz(id);
            if (res?._id) {
                setQuiz(res);
            } else {
                throw new Error("Quiz not found");
            }
        } catch (e: any) {
            displayMsg(e.message, "error");
            navigate("/admin/quiz");
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
                            <QuestionsPart />
                        </section>
                        <DangerPart quizId={quiz._id} />
                    </AdminQuizContextProvider>
                )}
            </div>
        </div>
    );
}

function EditQuizDataForm() {
    const { quiz, reload } = useAdminQuizContext();
    const { register: registerField, handleSubmit, reset } = useForm();

    const submitForm = async (data: any) => {
        try {
            await quizService.update(quiz._id, {
                ...data,
                duration: parseInt(data.duration),
            });
            reload();
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        if (quiz && quiz._id) {
            reset();
        }
    }, [quiz]);

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
                min={1}
                max={60}
                register={registerField("duration", {
                    value: quiz.duration,
                })}
            />

            <TextArea
                placeholder="Description"
                register={registerField("description", {
                    value: quiz.description,
                })}
            />

            <Button type="submit">Apply</Button>
        </form>
    );
}

function QuestionsPart() {
    const { quiz, reload } = useAdminQuizContext();
    const [activeTab, setActiveTab] = useState(-1);
    const activeQuestion = quiz?.questions[activeTab] ?? null;

    const addQuestion = async (question: any) => {
        try {
            if (!quiz?._id) throw new Error("Quiz id is not defined");
            if (!question.label || question.label.trim() === "") {
                throw new Error("Question label is required");
            }
            await quizService.createQuestion(quiz._id, {
                ...question,
                label: question.label.trim(),
            });
            reload();
            setActiveTab(-1);
            notify("Question added");
            return true;
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const editQuestion = async (id: string, data: any) => {
        try {
            await quizService.updateQuestion(id, data);
            reload();
            notify("Question updated");
            return true;
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const deleteQuestion = async (id: string) => {
        try {
            await quizService.deleteQuestion(id);
            setActiveTab(-1);
            reload();
            notify("Question deleted");
            return true;
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl">
                    Questions ({quiz?.questions?.length ?? 0})
                </h3>
            </div>
            {quiz && (
                <>
                    <div className="tabs tabs-boxed">
                        <p
                            className={`tab ${
                                -1 === activeTab ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab(-1)}
                        >
                            New question
                        </p>
                        {quiz.questions.map((question, index) => (
                            <p
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`tab ${
                                    index === activeTab ? "tab-active" : ""
                                }`}
                            >
                                {question.label}
                            </p>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 border border-1 p-3 rounded rounded-md">
                        {activeQuestion ? (
                            <QuestionForm
                                type="edit"
                                submitAction={(data: any) =>
                                    editQuestion(activeQuestion._id, data)
                                }
                                deleteAction={() =>
                                    deleteQuestion(activeQuestion._id)
                                }
                                initData={activeQuestion}
                            />
                        ) : (
                            <QuestionForm
                                type="create"
                                submitAction={addQuestion}
                                initData={null}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

interface DangerPartProps {
    quizId: string;
}

function DangerPart({ quizId }: DangerPartProps) {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const deleteQuiz = async () => {
        try {
            if (!quizId) throw new Error("Id is not defined");
            await quizService.deleteQuiz(quizId);
            displayMsg("Quiz deleted");
            navigate("/admin/quiz");
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    if (!quizId) return null;

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl">Danger Zone 🚨</h2>
            <Button visual="danger" onClick={() => setShowModal(true)}>
                Delete this quiz
            </Button>
            <PromptDeleteModal
                isOpen={showModal}
                setIsOpen={setShowModal}
                confirm={deleteQuiz}
            />
        </div>
    );
}
