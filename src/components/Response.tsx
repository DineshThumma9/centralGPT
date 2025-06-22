import {Box, Flex, VStack} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import EmptyState from "./EmptyState.tsx";
import UserRequest from "./UserRequest.tsx";
import AIResponse from "./AIResponse.tsx";
import Empty from "./Empty.tsx";

const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        setMessages(sessionStore.getState().messages);
        return unsubscribe;
    }, []);

    // Handle auto-scroll with user scroll detection
    useEffect(() => {
        if (isAutoScrollEnabled && containerRef.current) {
            const container = containerRef.current;
            const scrollToBottom = () => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth",
                });
            };

            // Small delay to ensure DOM updates are complete
            const timeoutId = setTimeout(scrollToBottom, 10);
            return () => clearTimeout(timeoutId);
        }
    }, [messages, isAutoScrollEnabled]);

    // Detect user manual scrolling
    const handleScroll = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const isNearBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight < 100;

            setIsAutoScrollEnabled(isNearBottom);
        }
    };

    return (
        <Box
            ref={containerRef}
            h="100%"
            w="full"
            overflowY="auto"
            bg="linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 50%, #0f0a1a 100%)"
            onScroll={handleScroll}
            css={{
                '&::-webkit-scrollbar': {
                    width: '10px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'rgba(139, 69, 197, 0.1)',
                    borderRadius: '12px',
                    border: '2px solid transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(180deg, #8b45c5 0%, #6b46c1 100%)',
                    borderRadius: '12px',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    boxShadow: '0 0 10px rgba(139, 69, 197, 0.3)',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: 'linear-gradient(180deg, #9f4fd9 0%, #7c3aed 100%)',
                    boxShadow: '0 0 15px rgba(139, 69, 197, 0.5)',
                },
            }}
        >
            <Empty />
            {messages.length === 0 ? (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="60vh"
                >
                    <EmptyState />
                </Box>
            ) : (
                <Box
                    w="full"
                    maxW="4xl"
                    mx="auto"
                    px={{ base: 4, md: 6 }}
                    py={8}
                >
                    <VStack gap={8} align="stretch" w="full">
                        {messages.map((msg, idx) => (
                            <Box
                                key={`${msg.message_id || idx}-${msg.timestamp || Date.now()}`}
                                ref={idx === messages.length - 1 ? lastMessageRef : undefined}
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: msg.sender === "user" ? 'auto' : 0,
                                    right: msg.sender === "user" ? 0 : 'auto',
                                    width: '4px',
                                    height: '100%',
                                    bg: msg.sender === "user"
                                        ? 'linear-gradient(180deg, #8b45c5 0%, #6b46c1 100%)'
                                        : 'linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)',
                                    borderRadius: '2px',
                                    opacity: 0.6,
                                }}
                                pl={msg.sender === "user" ? 0 : 4}
                                pr={msg.sender === "user" ? 4 : 0}
                            >
                                <Flex
                                    justify={msg.sender === "user" ? "flex-end" : "flex-start"}
                                    w="full"
                                >
                                    <Box
                                        maxW={{ base: "90%", md: "85%", lg: "80%" }}
                                        w="full"
                                        borderRadius="20px"
                                        overflow="hidden"
                                        boxShadow={msg.sender === "user"
                                            ? "0 8px 32px rgba(139, 69, 197, 0.15)"
                                            : "0 8px 32px rgba(6, 182, 212, 0.15)"}
                                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: msg.sender === "user"
                                                ? "0 12px 40px rgba(139, 69, 197, 0.25)"
                                                : "0 12px 40px rgba(6, 182, 212, 0.25)",
                                        }}
                                    >
                                        {msg.sender === "user" ? (
                                            <UserRequest msg={msg} />
                                        ) : (
                                            <AIResponse msg={msg} idx={idx} />
                                        )}
                                    </Box>
                                </Flex>
                            </Box>
                        ))}
                    </VStack>

                    {/* Scroll to bottom indicator */}
                    {!isAutoScrollEnabled && (
                        <Box
                            position="fixed"
                            bottom="100px"
                            right="20px"
                            zIndex={1000}
                        >
                            <Box
                                bg="linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)"
                                color="white"
                                px={6}
                                py={3}
                                borderRadius="25px"
                                fontSize="sm"
                                fontWeight="medium"
                                cursor="pointer"
                                boxShadow="0 8px 32px rgba(139, 69, 197, 0.3)"
                                _hover={{
                                    bg: "linear-gradient(135deg, #9f4fd9 0%, #7c3aed 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 40px rgba(139, 69, 197, 0.4)"
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                border="1px solid rgba(139, 69, 197, 0.2)"
                                backdropFilter="blur(20px)"
                                onClick={() => {
                                    setIsAutoScrollEnabled(true);
                                    if (containerRef.current) {
                                        containerRef.current.scrollTo({
                                            top: containerRef.current.scrollHeight,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                            >
                                ↓ New messages
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Response;