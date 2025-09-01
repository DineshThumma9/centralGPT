import {Box, Flex, VStack} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import EmptyState from "./EmptyState.tsx";
import UserRequest from "./UserRequest.tsx";
import AIResponse from "./AIResponse.tsx";
const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [prevMessageCount, setPrevMessageCount] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const shouldAutoScroll = useRef(true);
    const box = {
        h: "100%",
        w: "full",
        overflowY: "auto" as const,
        overflowX: "hidden" as const,
        bg: "bg.canvas",
        position: "relative" as const,
        scrollBehavior: "smooth" as const,
    };

    const vstack = {
        gap: 3,
        align: "stretch" as const,
        w: "full",
        maxW: "4xl",
        bg: "bg.canvas",
        mx: "auto",
        px: 1,
        py: 1,
    };

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        setMessages(sessionStore.getState().messages);
        return unsubscribe;
    }, []);

    // Handle scroll detection
    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const threshold = 100; // pixels from bottom
            const atBottom = scrollTop + clientHeight >= scrollHeight - threshold;
            shouldAutoScroll.current = atBottom;
        }
    };

    // Smart scrolling logic
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Only scroll if:
        // 1. New message was added (not just content update)
        // 2. User is at the bottom or it's the first message
        const newMessageAdded = messages.length > prevMessageCount;
        const shouldScroll = newMessageAdded && (shouldAutoScroll.current || messages.length === 1);

        if (shouldScroll) {
            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: messages.length === 1 ? "auto" : "smooth",
                });
            });
        }

        setPrevMessageCount(messages.length);
    }, [messages, prevMessageCount]);

    // Add scroll listener
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <Box
            ref={containerRef}
            {...box}
        >

            {messages.length === 0 ? (
                <EmptyState/>
            ) : (
                <Box w="full" py={6}>
                    <VStack
                        {...vstack}
                    >
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                w="100%"
                                maxW="100%"
                            >
                                {msg.sender === "user" ? (
                                    <Flex justify="flex-end" w="100%">
                                        <Box w="100%" maxW="100%">
                                            <UserRequest msg={msg}/>
                                        </Box>
                                    </Flex>
                                ) : (
                                    <Flex justify="flex-start" w="100%">
                                        <Box w="100%" maxW="100%">
                                            <AIResponse msg={msg} idx={idx}/>
                                        </Box>
                                    </Flex>
                                )}
                            </Box>
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default Response;