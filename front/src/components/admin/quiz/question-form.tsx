import { useForm } from "react-hook-form";
import { Question } from "../../../interfaces/quiz";
import Button from "../../button";
import { Input } from "../../input";

interface QuestionFormProps {
    initData?: Question | null;
    type: "create" | "edit";
}

export default function QuestionForm({ initData, type }: QuestionFormProps) {
    const { register: registerField, handleSubmit, reset } = useForm();

    const onSubmit = (data: any) => {};

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                register={registerField("label", { value: initData?.label })}
            />
            <Button type="submit">{type == "create" ? "Add" : "Apply"}</Button>
        </form>
    );
}
