import { useEffect, useState } from "react";
import { ResultData } from "../../interfaces/quiz";
import quizService from "../../services/quiz.service";
import { displayMsg } from "../../utils/toast";

interface BadgesPartProps {
    userId: string;
}

export default function BadgesPart({ userId }: BadgesPartProps) {
    const [successes, setSuccesses] = useState<ResultData[]>([]);

    const fetchResults = async () => {
        try {
            const res = await quizService.getUserSuccesses(userId);
            setSuccesses(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchResults();
    }, [userId]);

    if (!successes.length) return null;

    return (
        <div className="w-full h-fit border flex flex-col gap-3 border-1 border-slate-300 rounded-md p-5 overflow-hidden w-full ">
            <h3 className="font-bold">Skills</h3>
            <p className="text-slate-400 text-xs">
                This user has obtained more than 50% at the following skill
                tests provided by Cinqoo.
            </p>
            <ul>
                {successes.map((s, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 1200 1200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 0V1200H1200V424.289L1003.12 621.164V1003.12H196.875V196.875H578.836L775.711 0H0ZM1030.01 15.161L595.828 449.411L440.7 294.283L281.618 453.438L595.821 767.57L754.903 608.488L1189.08 174.238L1030 15.157L1030.01 15.161Z"
                                fill="#1DBF73"
                            />
                        </svg>
                        {s.quiz?.name ?? ""}
                    </li>
                ))}
            </ul>
        </div>
    );
}
