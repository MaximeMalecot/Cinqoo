import { useCallback, useState } from "react";
import Button from "../button";

interface ConversationLayoutProps {
    send: (data: any) => void;
    messages: any[];
    loading: boolean;
    config: {
        title: string;
    };
    allowSend?: boolean;
}

export default function ConversationLayout({
    send,
    messages,
    loading,
    config,
    config: { title },
    allowSend = true,
}: ConversationLayoutProps) {
    const [typed, setTyped] = useState("");

    const handleSubmit = useCallback(
        (e: any) => {
            e.preventDefault();
            if (!typed) return;
            if (typed.trim().length === 0) return;
            send(typed.trim());
        },
        [typed]
    );

    return (
        <form
            onSubmit={handleSubmit}
            style={{ height: "60vh" }}
            className="border border-1 border-slate-300 rounded-md overflow-hidden w-full shadow-xl flex flex-col"
        >
            <div
                style={{ height: "20%" }}
                className="flex flex-col w-full p-5 border border-slate-300 border-b-1 border-t-0 border-x-0"
                id="header"
            >
                <h2 className="text-xl">{title}</h2>
            </div>
            <div
                style={{ height: "60%" }}
                className="bg-slate-200 flex flex-col gap-3 p-5 overflow-y-scroll border border-slate-300 border-b-1 border-t-0 border-x-0"
            >
                {messages.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center">
                        There is no message yet
                    </p>
                ) : null}
            </div>
            {allowSend ? (
                <div
                    className="flex flex-col p-5 gap-3"
                    style={{ height: "30%" }}
                >
                    <textarea
                        placeholder="Type your message here..."
                        className="bg-white h-full w-full !outline-none border border-slate-300 rounded-md p-5 resize-none"
                    />
                    <Button
                        visual="primary"
                        onClick={() => {}}
                        className="w-fit ml-auto px-10"
                    >
                        Send
                    </Button>
                </div>
            ) : (
                <div
                    className="flex flex-col p-5 gap-3"
                    style={{ height: "30%" }}
                >
                    <p>Messages are disabled</p>
                </div>
            )}
        </form>
    );
}
