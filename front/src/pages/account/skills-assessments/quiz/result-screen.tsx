import { Link } from "react-router-dom";

export default function ResultScreen({ result }: { result: number }) {
    const hasSucceeded = result >= 50;
    return (
        <div className="hero min-h-full bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">{result}%</h1>
                    {hasSucceeded ? (
                        <p className="py-6">
                            Congratulations! You have passed the assessment. The
                            badge will be added to your profile.
                        </p>
                    ) : (
                        <p className="py-6">
                            Unfortunately, you have not passed the assessment.
                            You can try again in a few days.
                        </p>
                    )}
                    <Link to={"/account/skills-assessments"}>
                        <button className="btn btn-primary">
                            Browse skills assessments
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
