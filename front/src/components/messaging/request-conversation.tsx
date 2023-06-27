import { useCallback, useState } from "react";
import { ORDER_STATUS } from "../../constants/status";
import { Request } from "../../interfaces/request";
import ConversationLayout from "./conversation-layout";

interface RequestConversationProps {
    request: Request;
}

export default function RequestConversation({
    request,
}: RequestConversationProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const send = useCallback((data: any) => {}, []);
    const canSend =
        request.status !== ORDER_STATUS.DONE &&
        request.status !== ORDER_STATUS.CANCELLED &&
        request.status !== ORDER_STATUS.REFUSED;

    return (
        <ConversationLayout
            send={send}
            messages={messages}
            loading={loading}
            config={{ title: "Request for: " + request.prestation.name }}
            allowSend={canSend}
        />
    );
}
