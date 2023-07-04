import { useEffect, useState } from "react";
import { AnswerAdmin } from "../../../interfaces/quiz";
import Button from "../../button";
import { Input } from "../../input";

interface AnswerProps {
    data?: AnswerAdmin | null;
    deleteAnswer?: (answer: AnswerAdmin) => void;
    action: (answer: AnswerAdmin) => void;
    type: "create" | "edit";
}

export default function AnswerItem({
    data,
    action,
    deleteAnswer,
    type,
}: AnswerProps) {
    const [label, setLabel] = useState<string>("");
    const [isRight, setIsRight] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setLabel(data.label);
            setIsRight(data.isRight);
        }
    }, [data]);

    const handleAction = () => {
        const answer: AnswerAdmin = {
            label,
            isRight,
        };
        action(answer);
        if (type === "create") {
            setLabel("");
            setIsRight(false);
        }
    };

    const handleActionWrapper = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        handleAction();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (data && deleteAnswer) {
            deleteAnswer(data);
        }
    };

    return (
        <div
            className={`flex flex-col p-2 rounded-md ${
                type === "edit" ? "bg-slate-200" : "border border-1"
            }`}
        >
            {type === "create" && <p className="text-md">New answer</p>}
            <Input
                placeholder="Label"
                type="text"
                value={label}
                onKeyUp={(e) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                        handleAction();
                    }
                }}
                onChange={(e) => setLabel(e.target.value)}
            />
            <div className="form-control w-52">
                <label className="cursor-pointer label">
                    <span className="label-text">Is right</span>
                    <input
                        onClick={() => setIsRight((prev) => !prev)}
                        type="checkbox"
                        className="toggle toggle-accent"
                        checked={!!isRight}
                        readOnly
                    />
                </label>
            </div>
            <Button
                visual="bordered-primary"
                className="bg-white"
                onClick={handleActionWrapper}
            >
                Apply
            </Button>
            {deleteAnswer && (
                <Button visual="danger" onClick={handleDelete}>
                    Delete
                </Button>
            )}
        </div>
    );
}
