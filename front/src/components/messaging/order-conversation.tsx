import { useCallback, useEffect, useRef, useState } from "react";
import { ORDER_STATUS } from "../../constants/status";
import { useAuthContext } from "../../contexts/auth.context";
import { MessageI } from "../../interfaces/message";
import { Order } from "../../interfaces/order";
import eventSourceService from "../../services/event-source.service";
import messageService from "../../services/message.service";
import { displayMsg } from "../../utils/toast";
import ConversationLayout from "./conversation-layout";

interface OrderConversationProps {
    order: Order;
    isVisible?: boolean;
}

export default function OrderConversation({
    order,
    isVisible = true,
}: OrderConversationProps) {
    const [messages, setMessages] = useState<MessageI[]>([]);
    const { data } = useAuthContext();
    const [loading] = useState(false);
    const canSend =
        order.status !== ORDER_STATUS.DONE &&
        order.status !== ORDER_STATUS.CANCELLED &&
        order.status !== ORDER_STATUS.REFUSED;
    const eventSource = useRef<EventSource | null>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await messageService.getMessages(order._id);
            setMessages(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    }, [order]);

    const send = useCallback(
        async (content: string) => {
            try {
                await messageService.sendMessage(order._id, content);
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [order]
    );

    const setupEventSource = useCallback(async () => {
        const sse = await eventSourceService.getOrderSSE();
        eventSource.current = sse;
        sse.addEventListener("new_message", (data: any) => {
            try {
                const message = JSON.parse(data.data).data;
                if (message.orderId === order._id) {
                    setMessages((prev) => [...prev, message]);
                }
            } catch (e: any) {
                console.log(e.message);
            }
        });
    }, [order]);

    useEffect(() => {
        fetchMessages();
        setupEventSource();
        return () => {
            if (eventSource.current) {
                eventSource.current.close();
            }
        };
    }, [order]);

    if (!order._id) return null;

    return (
        <ConversationLayout
            send={send}
            messages={messages}
            loading={loading}
            config={{ title: order.prestation.name }}
            allowSend={canSend}
            ownerId={data!._id}
            triggerScroll={isVisible}
        />
    );
}
