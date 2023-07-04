import { useForm } from "react-hook-form";
import { Answer, Question } from "../../../interfaces/quiz";
import Button from "../../button";
import { Input } from "../../input";
import AnswerItem from "./answer-item";

interface QuestionFormProps {
    initData?: Question | null;
    type: "create" | "edit";
}

export default function QuestionForm({ initData, type }: QuestionFormProps) {
    const { register: registerField, handleSubmit, reset } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
        reset();
    };

    const addAnswer = (data: Answer) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Input
                placeholder="Label"
                register={registerField("label", { value: initData?.label })}
            />
            <div className="divider my-0"></div>
            <p>Answers:</p>
            {!initData?.answers ||
                (initData.answers.length == 0 && <p>There is no answer</p>)}
            {initData?.answers &&
                initData?.answers?.length > 0 &&
                initData?.answers.map((answer) => <AnswerItem data={answer} />)}
            <Button visual={"bordered-primary"} type="submit">
                {type == "create" ? "Add" : "Apply"}
            </Button>
        </form>
    );
}
