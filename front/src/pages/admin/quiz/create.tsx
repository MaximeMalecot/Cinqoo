import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { TextArea } from "../../../components/text-area";
import quizService from "../../../services/quiz.service";
import { displayMsg } from "../../../utils/toast";

export default function AdminCreateQuiz() {
    const navigate = useNavigate();
    const { register: registerField, handleSubmit } = useForm();

    const submitForm = async (data: any) => {
        try {
            const res = await quizService.create(
                data.name,
                parseInt(data.duration),
                data.description
            );
            navigate(`/admin/quiz/${res._id}`);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    return (
        <div className=" overflow-x-auto container mx-auto flex flex-col gap-3 p-5">
            <h1 className="text-2xl">Create a new Quiz</h1>
            <form
                onSubmit={handleSubmit(submitForm)}
                className="flex flex-col gap-3"
            >
                <Input placeholder="Name" register={registerField("name")} />
                <Input
                    placeholder="Duration (in minutes)"
                    type="number"
                    step="0.1"
                    min={1}
                    max={60}
                    register={registerField("duration")}
                />
                <TextArea
                    placeholder="Description"
                    register={registerField("description")}
                />
                <Button type="submit">Create</Button>
            </form>
        </div>
    );
}
