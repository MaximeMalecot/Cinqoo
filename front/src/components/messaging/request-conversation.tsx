import { useCallback, useEffect, useState } from "react";
import { ORDER_STATUS } from "../../constants/status";
import { useAuthContext } from "../../contexts/auth.context";
import { MessageI } from "../../interfaces/message";
import { Request } from "../../interfaces/request";
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
    const [loading, setLoading] = useState(false);
    const canSend =
        request.status !== ORDER_STATUS.DONE &&
        request.status !== ORDER_STATUS.CANCELLED &&
        request.status !== ORDER_STATUS.REFUSED;

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
                const res = await messageService.sendMessage(
                    request._id,
                    content
                );
                setMessages((prev) => [...prev, res]);
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [request]
    );

    useEffect(() => {
        fetchMessages();
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
