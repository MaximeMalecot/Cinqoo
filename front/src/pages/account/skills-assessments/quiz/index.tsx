import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { WEBSOCKET_ENDPOINT } from "../../../../constants/endpoints";
import {
    CLIENT_EVENTS,
    SERVER_EVENTS,
} from "../../../../constants/quiz_events";
import { useAuthContext } from "../../../../contexts/auth.context";
import { QuizData } from "../../../../interfaces/quiz";
import quizService from "../../../../services/quiz.service";
import { displayMsg } from "../../../../utils/toast";
import QuestionScreen from "./question-screen";

enum SCREENS {
    CONNECTING = "CONNECTING",
    DISPLAY_QUESTION = "DISPLAY_QUESTION",
    WAITING = "WAITING",
    RESULTS = "RESULTS",
}

export interface RECEIVED_QUESTION {
    label: string;
    answers: RECEIVED_ANSWER[];
}

export interface RECEIVED_ANSWER {
    _id: string;
    label: string;
    isRight: boolean;
}

export default function Quiz() {
    const { token } = useAuthContext();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const { id } = useParams();
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();
    const [screen, setScreen] = useState<SCREENS>(SCREENS.CONNECTING);
    const [question, setQuestion] = useState<RECEIVED_QUESTION | null>(null);
    const [result, setResult] = useState<number>(0);
    const [warnings, setWarnings] = useState<number>(0);

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

    const setListeners = () => {
        if (!socketRef.current) return;

        console.log("%cListeners set %s", "color: red");

        socketRef.current.on("disconnect", (e) => {
            console.log(e);
        });

        socketRef.current.on(SERVER_EVENTS.CONNECT, () => {
            console.log("connected");
            setScreen(SCREENS.WAITING);
        });

        socketRef.current.on(
            SERVER_EVENTS.NEW_QUESTION,
            (received_question: RECEIVED_QUESTION) => {
                console.log(received_question);
                if (!received_question) return;
                setScreen(SCREENS.DISPLAY_QUESTION);
                setQuestion(received_question);
            }
        );

        socketRef.current.on(SERVER_EVENTS.ERROR, (e) => {
            console.log(e);
        });

        socketRef.current.on(SERVER_EVENTS.QUIZ_OVER, (e: any) => {
            setScreen(SCREENS.RESULTS);
            console.log(e);
            setResult(e.results);
        });

        socketRef.current.on(SERVER_EVENTS.WARNING, (e: any) => {
            setWarnings(e.warnings);
            displayMsg(e.message, "error");
        });

        socketRef.current.emit(CLIENT_EVENTS.START_QUIZ, {
            quizId: id,
        });
    };

    const removeListeners = () => {
        if (!socketRef.current) return;
        socketRef.current.off("disconnect");
        socketRef.current.off(SERVER_EVENTS.CONNECT);
        socketRef.current.off(SERVER_EVENTS.ERROR);
        socketRef.current.off(SERVER_EVENTS.PING);
        socketRef.current.off(SERVER_EVENTS.NEW_QUESTION);
        socketRef.current.off(SERVER_EVENTS.QUIZ_OVER);
        socketRef.current.off(SERVER_EVENTS.WARNING);
    };

    useEffect(() => {
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    useEffect(() => {
        if (!quiz) return;

        if (!socketRef.current) {
            const newSocket = io(WEBSOCKET_ENDPOINT, {
                path: "/sockets/quiz",
                autoConnect: true,
                extraHeaders: {
                    Authorization: "Bearer " + token,
                },
            });
            socketRef.current = newSocket;
            setSocket(newSocket);
            setListeners();
        }

        const tabFocusedCb = (e: any) => {
            if (e.target.visibilityState === "hidden") {
                if (socketRef.current) {
                    socketRef.current.emit(CLIENT_EVENTS.TAB_HIDDEN);
                }
            }
        };

        document.addEventListener("visibilitychange", tabFocusedCb);

        return () => {
            if (socket) {
                removeListeners();
                socket.close();
                socket.disconnect();
                setSocket(null);
                socketRef.current = null;
            }
            document.removeEventListener("visibilitychange", tabFocusedCb);
        };
    }, [quiz]);

    const answerQuestion = (answers: string[]) => {
        if (!socketRef.current) return;
        socketRef.current.emit(CLIENT_EVENTS.ANSWER_QUESTION, {
            answers,
        });
        setScreen(SCREENS.WAITING);
    };

    if (!quiz)
        return (
            <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5 bg-white">
                <h1>Fetching quiz</h1>
            </div>
        );

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5 bg-white">
            <div className="flex flex-col gap-5 border border-1 rounded-md overflow-hidden p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">{quiz.name}</h1>
                    {warnings > 0 && <p>Warnings: {warnings}</p>}
                </div>
                {socket && (
                    <div>
                        {screen === SCREENS.WAITING && (
                            <div className="flex flex-col items-center">
                                <p>Waiting </p>
                                <span className="loading loading-spinner"></span>
                            </div>
                        )}
                        {screen === SCREENS.DISPLAY_QUESTION && (
                            <QuestionScreen
                                question={question}
                                onSubmit={answerQuestion}
                            />
                        )}
                        {screen === SCREENS.RESULTS && <p>{result ?? 0}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
