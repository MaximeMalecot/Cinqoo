import { useState } from "react";
import QuizzesPart from "./quizzes-part";
import ResultsPart from "./results-part";

export default function EvaluateSkills() {
    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                    <h1 className="text-xl">
                        Assess your skills and obtain badges to prove it.
                    </h1>
                    <p className="text-slate-500">
                        Check your skill level. Answer several multiple-choice
                        questions, get more than 50% right, and earn a badge of
                        competence.
                    </p>
                </div>
                <div className="tabs border border-slate-300 border-b-1 border-t-0 border-x-0">
                    <p
                        className={`text-xl tab ${
                            activeTab === 0 ? "tab-active text-primary" : ""
                        }`}
                        onClick={() => setActiveTab(0)}
                    >
                        All quizzes
                    </p>
                    <p
                        className={`text-xl tab ${
                            activeTab === 1 ? "tab-active text-primary" : ""
                        }`}
                        onClick={() => setActiveTab(1)}
                    >
                        Quiz results
                    </p>
                </div>
                <div
                    style={{
                        display: activeTab === 0 ? "block" : "none",
                    }}
                >
                    <QuizzesPart />
                </div>
                <div
                    style={{
                        display: activeTab === 1 ? "block" : "none",
                    }}
                >
                    <ResultsPart />
                </div>
            </div>
        </div>
    );
}
