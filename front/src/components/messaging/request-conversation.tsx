import { useCallback, useEffect, useRef, useState } from "react";
import { ORDER_STATUS } from "../../constants/status";
import { useAuthContext } from "../../contexts/auth.context";
import { MessageI } from "../../interfaces/message";
import { Request } from "../../interfaces/request";
import eventSourceService from "../../services/event-source.service";
import messageService from "../../services/message.service";
import { displayMsg } from "../../utils/toast";
import ConversationLayout from "./conversation-layout";

interface RequestConversationProps {
    request: Request;
    isVisible?: boolean;
}

export default function RequestConversation({
    request,
    isVisible = false,
}: RequestConversationProps) {
    const { data } = useAuthContext();
    const [messages, setMessages] = useState<MessageI[]>([]);
    const [loading] = useState(false);
    const canSend =
        request.status !== ORDER_STATUS.DONE &&
        request.status !== ORDER_STATUS.CANCELLED &&
        request.status !== ORDER_STATUS.REFUSED;
    const eventSource = useRef<EventSource | null>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await messageService.getMessages(request._id);
            setMessages(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [request]);

    const send = useCallback(
        async (content: string) => {
            try {
                await messageService.sendMessage(request._id, content);
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [request]
    );

    const setupEventSource = useCallback(async () => {
        const sse = await eventSourceService.getOrderSSE();
        eventSource.current = sse;
        sse.addEventListener("new_message", (data: any) => {
            try {
                const message = JSON.parse(data.data).data;
                if (message.orderId === request._id) {
                    setMessages((prev) => [...prev, message]);
                }
            } catch (e: any) {
                console.log(e.message);
            }
        });
    }, [request]);

    useEffect(() => {
        fetchMessages();
        setupEventSource();
        return () => {
            if (eventSource.current) {
                eventSource.current.close();
            }
        };
    }, []);

    return (
        <ConversationLayout
            send={send}
            messages={messages}
            loading={loading}
            config={{ title: "Request for: " + request.prestation.name }}
            allowSend={canSend}
            ownerId={data!._id}
            triggerScroll={isVisible}
        />
    );
}
