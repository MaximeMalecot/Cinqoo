import { useEffect, useState } from "react";
import { displayMsg } from "../../../utils/toast";

export default function ResultsPart() {
    const [results, setResults] = useState<any[]>([]);

    const fetchResults = async () => {
        try {
            setResults([]);
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
                        <th>Name</th>
                        <th>Questions</th>
                        <th>Duration (minutes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index} className="bg-base-200"></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
