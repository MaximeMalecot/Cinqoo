import { useEffect, useState } from "react";
import { RECEIVED_QUESTION } from ".";
import Button from "../../../../components/button";

interface QuestionScreenProps {
    question: RECEIVED_QUESTION | null;
    onSubmit: (answers: string[]) => void;
}

export default function QuestionScreen({
    question,
    onSubmit,
}: QuestionScreenProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

    const handleSelect = async (id: string) => {
        if (!question) return;
        if (!id) return;

        if (selectedAnswers.includes(id)) {
            setSelectedAnswers((prev) => {
                const tmp = new Set([...prev]);
                tmp.delete(id);
                return Array.from(tmp);
            });
        } else {
            setSelectedAnswers((prev) => {
                const tmp = new Set([...prev, id]);
                return Array.from(tmp);
            });
        }
    };

    if (!question) return <div></div>;

    useEffect(() => {
        setSelectedAnswers([]);
    }, [question]);

    return (
        <div className="flex flex-col gap-3">
            <h2>{question?.label}</h2>
            <div className="flex flex-wrap gap-5">
                {question.answers.map((question, index) => (
                    <Button
                        onClick={() => handleSelect(question._id)}
                        visual={
                            selectedAnswers.includes(question._id)
                                ? "secondary"
                                : "bordered-secondary"
                        }
                        className="flex-1"
                        key={index}
                    >
                        {question.label}
                    </Button>
                ))}
            </div>
            <Button
                onClick={() =>
                    selectedAnswers.length > 0
                        ? onSubmit(selectedAnswers)
                        : null
                }
                disabled={selectedAnswers.length === 0}
                visual="primary"
            >
                Send
            </Button>
        </div>
    );
}
