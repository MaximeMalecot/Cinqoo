import { useCallback, useState } from "react";
import { ORDER_STATUS } from "../../constants/status";
import { Order } from "../../interfaces/order";
import ConversationLayout from "./conversation-layout";

interface OrderConversationProps {
    order: Order;
}

export default function OrderConversation({ order }: OrderConversationProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const send = useCallback((data: any) => {}, []);
    const canSend =
        order.status !== ORDER_STATUS.DONE &&
        order.status !== ORDER_STATUS.CANCELLED &&
        order.status !== ORDER_STATUS.REFUSED;

    return (
        <ConversationLayout
            send={send}
            messages={messages}
            loading={loading}
            config={{ title: order.prestation.name }}
            allowSend={canSend}
        />
    );
}
