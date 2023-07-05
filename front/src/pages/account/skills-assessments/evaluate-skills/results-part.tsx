import { useEffect, useState } from "react";
import { ResultData } from "../../../../interfaces/quiz";
import quizService from "../../../../services/quiz.service";
import { displayMsg } from "../../../../utils/toast";

export default function ResultsPart() {
    const [results, setResults] = useState<ResultData[]>([]);

    const fetchResults = async () => {
        try {
            const res = await quizService.getSelfResults();
            setResults(res);
        } catch (e: any) {
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    if (results.length === 0) return <p>There is no result</p>;

    return (
        <div className="border-2 rounded rounded-md overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Quiz</th>
                        <th>Score</th>
                        <td>Success</td>
                        <th>Attempted at</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index} className="bg-base-200">
                            <td>{result.quiz?.name ?? "Quiz name"}</td>
                            <td className="capitalize">
                                {(!!result.success).toString()}
                            </td>
                            <td>{result.score}%</td>
                            <td>
                                {new Date(result.attemptedAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
