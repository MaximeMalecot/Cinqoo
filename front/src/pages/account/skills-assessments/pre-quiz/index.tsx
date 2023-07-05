import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/button";
import { QuizData } from "../../../../interfaces/quiz";
import quizService from "../../../../services/quiz.service";
import { displayMsg } from "../../../../utils/toast";

export default function PreQuiz() {
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchQuiz = async () => {
        try {
            if (!id) throw new Error("Id is not defined");
            const res = await quizService.getQuiz(id);
            if (res?._id) {
                setQuiz(res);
            } else {
                throw new Error("Quiz not found");
            }
        } catch (e: any) {
            displayMsg(e.message, "error");
            navigate("/account/skills-assessments");
        }
    };

    useEffect(() => {
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5 bg-white">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <p>Account</p>
                    </li>
                    <li>
                        <Link to="/account/skills-assessments">
                            Skills Assessments
                        </Link>
                    </li>
                    <li>{quiz ? quiz?.name : id}</li>
                </ul>
            </div>
            {quiz?._id && (
                <div className="flex flex-col gap-5 border border-1 rounded-md overflow-hidden p-6">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-5">
                            <h1 className="text-xl font-bold">{quiz.name}</h1>
                            <p className="text-slate-500">
                                {quiz.description || "No description"}
                            </p>
                        </div>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center gap-5">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 114 63"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.30002 63C4.51502 63 3.01772 62.3952 1.80812 61.1856C0.598521 59.976 -0.0041782 58.4808 2.17993e-05 56.7C2.17993e-05 54.915 0.604822 53.4177 1.81442 52.2081C3.02402 50.9985 4.51922 50.3958 6.30002 50.4C8.08502 50.4 9.58231 51.0048 10.7919 52.2144C12.0015 53.424 12.6042 54.9192 12.6 56.7C12.6 58.485 11.9952 59.9823 10.7856 61.1919C9.57601 62.4015 8.08082 63.0042 6.30002 63ZM6.30002 37.8C4.51502 37.8 3.01772 37.1952 1.80812 35.9856C0.598521 34.776 -0.0041782 33.2808 2.17993e-05 31.5C2.17993e-05 29.715 0.604822 28.2177 1.81442 27.0081C3.02402 25.7985 4.51922 25.1958 6.30002 25.2C8.08502 25.2 9.58231 25.8048 10.7919 27.0144C12.0015 28.224 12.6042 29.7192 12.6 31.5C12.6 33.285 11.9952 34.7823 10.7856 35.9919C9.57601 37.2015 8.08082 37.8042 6.30002 37.8ZM6.30002 12.6C4.51502 12.6 3.01772 11.9952 1.80812 10.7856C0.598521 9.57601 -0.0041782 8.08082 2.17993e-05 6.30002C2.17993e-05 4.51502 0.604822 3.01772 1.81442 1.80812C3.02402 0.598523 4.51922 -0.0041782 6.30002 2.17993e-05C8.08502 2.17993e-05 9.58231 0.604822 10.7919 1.81442C12.0015 3.02402 12.6042 4.51922 12.6 6.30002C12.6 8.08502 11.9952 9.58232 10.7856 10.7919C9.57601 12.0015 8.08082 12.6042 6.30002 12.6ZM25.2 63V50.4H113.4V63H25.2ZM25.2 37.8V25.2H113.4V37.8H25.2ZM25.2 12.6V2.17993e-05H113.4V12.6H25.2Z"
                                        fill="black"
                                    />
                                </svg>

                                <p>
                                    {quiz.totalQuestions} multiple-choice
                                    question(s)
                                </p>
                            </li>
                            <li className="flex items-center gap-5">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 92 92"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M46 82.8C55.76 82.8 65.1202 78.9229 72.0215 72.0215C78.9229 65.1202 82.8 55.76 82.8 46C82.8 36.24 78.9229 26.8798 72.0215 19.9785C65.1202 13.0771 55.76 9.2 46 9.2C36.24 9.2 26.8798 13.0771 19.9785 19.9785C13.0771 26.8798 9.2 36.24 9.2 46C9.2 55.76 13.0771 65.1202 19.9785 72.0215C26.8798 78.9229 36.24 82.8 46 82.8ZM46 0C52.0408 0 58.0225 1.18983 63.6034 3.50154C69.1844 5.81326 74.2554 9.20159 78.5269 13.4731C82.7984 17.7446 86.1867 22.8156 88.4985 28.3966C90.8102 33.9775 92 39.9592 92 46C92 58.2 87.1536 69.9002 78.5269 78.5269C69.9002 87.1536 58.2 92 46 92C20.562 92 0 71.3 0 46C0 33.8 4.84641 22.0998 13.4731 13.4731C22.0998 4.84641 33.8 0 46 0ZM48.3 23V47.15L69 59.432L65.55 65.09L41.4 50.6V23H48.3Z"
                                        fill="black"
                                    />
                                </svg>

                                <p>{quiz.duration} minute(s)</p>
                            </li>
                            <li className="flex items-center gap-5">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 153 178"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M112.309 48.016V38.25C112.309 37.3548 111.576 36.6223 110.681 36.6223H32.5532C31.658 36.6223 30.9255 37.3548 30.9255 38.25V48.016C30.9255 48.9112 31.658 49.6436 32.5532 49.6436H110.681C111.576 49.6436 112.309 48.9112 112.309 48.016ZM32.5532 65.9202C31.658 65.9202 30.9255 66.6527 30.9255 67.5479V77.3138C30.9255 78.209 31.658 78.9415 32.5532 78.9415H69.9894C70.8846 78.9415 71.617 78.209 71.617 77.3138V67.5479C71.617 66.6527 70.8846 65.9202 69.9894 65.9202H32.5532ZM109.053 89.5213C84.7807 89.5213 65.1064 109.196 65.1064 133.468C65.1064 157.741 84.7807 177.415 109.053 177.415C133.326 177.415 153 157.741 153 133.468C153 109.196 133.326 89.5213 109.053 89.5213ZM130.925 155.34C125.086 161.179 117.314 164.394 109.053 164.394C100.793 164.394 93.0207 161.179 87.1815 155.34C81.3423 149.501 78.1277 141.728 78.1277 133.468C78.1277 125.208 81.3423 117.436 87.1815 111.596C93.0207 105.757 100.793 102.543 109.053 102.543C117.314 102.543 125.086 105.757 130.925 111.596C136.764 117.436 139.979 125.208 139.979 133.468C139.979 141.728 136.764 149.501 130.925 155.34ZM127.161 118.005H118.148C117.619 118.005 117.13 118.249 116.825 118.677L103.906 136.54L99.2058 130.05C99.0553 129.84 98.8566 129.67 98.6265 129.553C98.3963 129.436 98.1415 129.376 97.8834 129.379H88.9109C87.5884 129.379 86.8153 130.884 87.5884 131.962L102.604 152.736C103.255 153.631 104.577 153.631 105.228 152.736L128.463 120.589C129.257 119.511 128.483 118.005 127.161 118.005ZM61.8511 157.883H14.6489V14.6489H128.585V84.6383C128.585 85.5335 129.318 86.266 130.213 86.266H141.606C142.502 86.266 143.234 85.5335 143.234 84.6383V6.51064C143.234 2.90944 140.325 0 136.723 0H6.51064C2.90944 0 0 2.90944 0 6.51064V166.021C0 169.622 2.90944 172.532 6.51064 172.532H61.8511C62.7463 172.532 63.4787 171.799 63.4787 170.904V159.511C63.4787 158.615 62.7463 157.883 61.8511 157.883Z"
                                        fill="black"
                                    />
                                </svg>
                                To obtain the badge, you must score at least 50%
                                of the questions
                            </li>
                        </ul>
                    </div>
                    <div className="divider my-0" />
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold">Before starting</h3>
                        <ul className="list-disc pl-10">
                            <li>
                                You need to complete this assessment in a single
                                session: make sure your Internet connection is
                                reliable.
                            </li>
                            <li>
                                You can retake the test in 1 hour if you fail.
                            </li>
                            <li>
                                If you fail, we will not show your results to
                                anyone without your permission.
                            </li>
                        </ul>
                    </div>
                    <div className="divider my-0" />
                    <Link
                        className="w-fit ml-auto"
                        to={`/account/skills-assessments/quiz/${quiz._id}`}
                    >
                        <Button visual="primary" className="w-fit ml-auto">
                            Start the quiz
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
