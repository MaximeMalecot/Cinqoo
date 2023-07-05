import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnswerAdmin, QuestionAdmin } from "../../../interfaces/quiz";
import { displayMsg } from "../../../utils/toast";
import Button from "../../button";
import { Input } from "../../input";
import AnswerItem from "./answer-item";

interface QuestionFormProps {
    initData?: QuestionAdmin | null;
    type: "create" | "edit";
    submitAction: (data: QuestionAdmin) => Promise<boolean | void>;
    deleteAction?: () => void;
}

export default function QuestionForm({
    initData,
    type,
    submitAction,
    deleteAction,
}: QuestionFormProps) {
    const { register: registerField, handleSubmit, reset } = useForm();
    const [answers, setAnswers] = useState<AnswerAdmin[]>([]);

    const onSubmit = async (data: any) => {
        try {
            if (data.label.trim() === "")
                throw new Error("Question label is empty");
            console.log("Question Form is sending");
            const res = await submitAction({ ...data, answers });
            console.log("Question Form is sent");
            if (res) {
                setAnswers([]);
                reset();
            }
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const updateAnswer = (index: number, answer: AnswerAdmin) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const deleteAnswer = (index: number) => {
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
    };

    const addAnswer = (answer: AnswerAdmin) => {
        if (!answer.label || answer.label.trim() === "") return;
        setAnswers([...answers, { ...answer, label: answer.label.trim() }]);
    };

    // useEffect(() => {
    //     if (initData) {
    //         setAnswers(initData.answers);
    //     }
    // }, [initData]);

    useEffect(() => {
        reset();
        if (initData) {
            setAnswers(initData.answers);
        } else {
            setAnswers([]);
        }
    }, [initData]);

    return (
        <div className="flex flex-col gap-5">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <h3 className="text-lg">
                    {type === "create"
                        ? "Create a question"
                        : "Edit a question"}
                </h3>
                <Input
                    placeholder="Label"
                    register={registerField("label", {
                        value: initData?.label,
                    })}
                />
                <div className="divider my-0"></div>
                <p>Answers:</p>
                {!answers && (
                    <p className="text-xs text-slate-400">There is no answer</p>
                )}
                {answers && answers?.length > 0 && (
                    <div className="flex gap-3 grid flex grid-cols-2">
                        {answers.map((answer, index) => (
                            <AnswerItem
                                key={index}
                                data={answer}
                                action={(data: any) =>
                                    updateAnswer(index, data)
                                }
                                deleteAnswer={() => deleteAnswer(index)}
                                type={"edit"}
                            />
                        ))}
                    </div>
                )}
                <AnswerItem action={addAnswer} type={"create"} />
                <Button visual={"bordered-primary"} type="submit">
                    {type == "create" ? "Add" : "Apply"}
                </Button>
            </form>
            {type === "edit" && (
                <Button visual="danger" onClick={deleteAction}>
                    Delete question
                </Button>
            )}
        </div>
    );
}
