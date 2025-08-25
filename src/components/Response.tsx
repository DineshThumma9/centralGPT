import {Box, Flex, VStack} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import EmptyState from "./EmptyState.tsx";
import UserRequest from "./UserRequest.tsx";
import AIResponse from "./AIResponse.tsx";
import { useColorMode } from "../contexts/ColorModeContext";

const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { colors } = useColorMode();

    // Optimized styles for better space utilization
    const box = {
        h: "100%",
        w: "full",
        overflowY: "auto" as const,
        overflowX: "hidden" as const,
        bg: colors.background.body, // Use theme background
        position: "relative" as const,
        // Custom scrollbar styling
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            bg: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            bg: colors.border.default,
            borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
            bg: colors.border.hover,
        },
    };

    const vstack = {
        gap: 3, // Even more reduced gap for compact layout
        align: "stretch" as const,
        w: "full",
        maxW: "4xl",
        mx: "auto",
        px: 1, // Minimal horizontal padding for maximum reading width
        py: 1, // Minimal vertical padding
    };

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        setMessages(sessionStore.getState().messages);
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

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