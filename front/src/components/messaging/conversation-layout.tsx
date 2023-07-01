import { useCallback, useEffect, useRef, useState } from "react";
import { MessageI } from "../../interfaces/message";
import Button from "../button";

interface ConversationLayoutProps {
    send: (data: any) => void;
    messages: MessageI[];
    loading: boolean;
    config: {
        title: string;
    };
    allowSend?: boolean;
    ownerId?: string;
    triggerScroll?: boolean;
}

const img =
    "https://images.unsplash.com/photo-1687851898832-650714860119?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

export default function ConversationLayout({
    send,
    messages,
    config: { title },
    allowSend = true,
    ownerId = "",
    triggerScroll = false,
}: ConversationLayoutProps) {
    const [typed, setTyped] = useState("");
    const lastMsgRef = useRef<HTMLDivElement>(null);
    const msgContainerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = useCallback(
        (e: any) => {
            e.preventDefault();
            if (!typed) return;
            if (typed.trim().length === 0) return;
            send(typed.trim());
            setTyped("");
            scrollToBottom();
        },
        [typed]
    );

    const scrollToBottom = useCallback(() => {
        if (lastMsgRef.current && msgContainerRef.current) {
            const { offsetTop } = lastMsgRef.current;
            msgContainerRef?.current?.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        }
    }, [lastMsgRef, msgContainerRef]);

    useEffect(() => {
        scrollToBottom();
    }, [triggerScroll, messages, scrollToBottom]);

    return (
        <form
            onSubmit={handleSubmit}
            style={{ height: "70vh" }}
            className="border border-1 border-slate-300 rounded-md overflow-hidden w-full shadow-xl flex flex-col"
        >
            <div
                style={{ height: "10%" }}
                className="flex flex-col items-center justify-center w-full p-5 border border-slate-300 border-b-1 border-t-0 border-x-0"
                id="header"
            >
                <h2 className="text-xl">{title}</h2>
            </div>
            <div
                style={{ height: "65%" }}
                className="bg-slate-200 flex flex-col gap-3 p-5 overflow-y-scroll border border-slate-300 border-b-1 border-t-0 border-x-0"
                ref={msgContainerRef}
            >
                {messages.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center">
                        There is no message yet
                    </p>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`chat ${
                                    message.senderId === ownerId
                                        ? "chat-end"
                                        : "chat-start"
                                }`}
                            >
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={img} />
                                    </div>
                                </div>
                                <div
                                    className={`chat-bubble ${
                                        message.senderId === ownerId
                                            ? "chat-bubble-accent text-white"
                                            : ""
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={lastMsgRef} />
                    </>
                )}
            </div>
            {allowSend ? (
                <div
                    className="flex flex-col p-5 gap-3"
                    style={{ height: "25%" }}
                >
                    <input
                        onChange={(e) => setTyped(e.target.value)}
                        value={typed}
                        placeholder="Type your message here..."
                        className="p-5 bg-white h-full w-full !outline-none border border-slate-300 rounded-md resize-none"
                    />
                    <Button
                        type="submit"
                        visual="primary"
                        className="w-fit ml-auto px-10"
                    >
                        Send
                    </Button>
                </div>
            ) : (
                <div
                    className="flex flex-col p-5 gap-3"
                    style={{ height: "20%" }}
                >
                    <p>Messages are disabled</p>
                </div>
            )}
        </form>
    );
}
