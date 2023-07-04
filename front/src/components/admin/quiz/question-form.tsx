import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnswerAdmin, QuestionAdmin } from "../../../interfaces/quiz";
import Button from "../../button";
import { Input } from "../../input";
import AnswerItem from "./answer-item";

interface QuestionFormProps {
    initData?: QuestionAdmin | null;
    type: "create" | "edit";
    submitAction: (data: QuestionAdmin) => void;
}

export default function QuestionForm({
    initData,
    type,
    submitAction,
}: QuestionFormProps) {
    const { register: registerField, handleSubmit, reset } = useForm();
    const [answers, setAnswers] = useState<AnswerAdmin[]>([]);

    const onSubmit = (data: any) => {
        console.log("Question Form is sending");
        submitAction({ ...data, answers });
        reset();
    };

    const updateAnswer = (index: number, answer: AnswerAdmin) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const deleteAnswer = (index: number, answer: AnswerAdmin) => {
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
    };

    const addAnswer = (answer: AnswerAdmin) => {
        setAnswers([...answers, { ...answer }]);
    };

    useEffect(() => {
        if (initData) {
            setAnswers(initData.answers);
        }
    }, [initData]);

    useEffect(() => {
        console.log(answers);
    }, [answers]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <h3 className="text-lg">
                {type === "create" ? "Create a question" : "Edit a question"}
            </h3>
            <Input
                placeholder="Label"
                register={registerField("label", { value: initData?.label })}
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
                            action={(data: any) => updateAnswer(index, data)}
                            deleteAnswer={(data: any) =>
                                deleteAnswer(index, data)
                            }
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
    );
}
