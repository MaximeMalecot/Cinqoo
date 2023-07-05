import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { WEBSOCKET_ENDPOINT } from "../../../../constants/endpoints";
import { SERVER_EVENTS } from "../../../../constants/quiz_events";
import { useAuthContext } from "../../../../contexts/auth.context";
import { QuizData } from "../../../../interfaces/quiz";
import quizService from "../../../../services/quiz.service";
import { displayMsg } from "../../../../utils/toast";

enum SCREENS {
    CONNECTING = "CONNECTING",
    DISPLAY_QUESTION = "DISPLAY_QUESTION",
    WAITING = "WAITING",
    RESULTS = "RESULTS",
}

export default function Quiz() {
    const { token } = useAuthContext();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const { id } = useParams();
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();
    const [screen, setScreen] = useState<SCREENS>(SCREENS.CONNECTING);

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

        socketRef.current.on(SERVER_EVENTS.NEW_QUESTION, (_) => {
            setScreen(SCREENS.DISPLAY_QUESTION);
        });

        socketRef.current.on(SERVER_EVENTS.ERROR, (e) => {
            console.log(e);
        });

        socketRef.current.on(SERVER_EVENTS.PING, (e) => {
            console.log(e);
            console.log("ping");
        });
        console.log("HERE");
        socketRef.current.emit("join_room", {});
    };

    const removeListeners = () => {
        if (!socketRef.current) return;
        socketRef.current.off("disconnect");
        socketRef.current.off(SERVER_EVENTS.CONNECT);
        socketRef.current.off(SERVER_EVENTS.ERROR);
        socketRef.current.off(SERVER_EVENTS.PING);
    };

    useEffect(() => {
        if (id) {
            fetchQuiz();
        }
    }, [id]);

    useEffect(() => {
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

        return () => {
            if (socket) {
                removeListeners();
                socket.close();
                socket.disconnect();
                setSocket(null);
                socketRef.current = null;
            }
        };
    }, [id]);

    if (!quiz)
        return (
            <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5 bg-white">
                <h1>Fetching quiz</h1>
            </div>
        );

    return (
        <div className="container mx-auto flex flex-col p-5 md:p-0 md:py-10 gap-5 bg-white">
            <div className="flex flex-col gap-5 border border-1 rounded-md overflow-hidden p-6">
                <h1 className="text-xl font-bold">{quiz.name}</h1>
                {socket && (
                    <div>
                        {screen === SCREENS.WAITING && (
                            <div className="flex flex-col items-center">
                                <p>Waiting </p>
                                <span className="loading loading-spinner"></span>
                            </div>
                        )}
                        {screen === SCREENS.DISPLAY_QUESTION && (
                            <p>QUESTION REPOND MTN</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
