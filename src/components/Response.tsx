import {
    Box,
    Center,
    Heading,
    VStack,
    Flex,
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";

const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        setMessages(sessionStore.getState().messages);
        return unsubscribe;
    }, []);

    // Scroll to bottom on message change
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
            flex="1"
            overflowY="auto"
            w="full"
            maxW="80%"
            mx="auto"
            px={4}
            bg="app.bg"
            css={{
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#404040',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#505050',
                },
            }}
        >
            {messages.length === 0 ? (
                <Center h="full">
                    <VStack gap={4}>
                        <Heading
                            fontSize="lg"
                            color="app.text.secondary"
                            fontWeight="medium"
                        >
                            Start a conversation
                        </Heading>
                        <Heading
                            fontSize="sm"
                            color="app.text.muted"
                            textAlign="center"
                            maxW="breakpoint-lg"
                        >
                            Choose a model and start chatting. Your messages will appear here.
                        </Heading>
                    </VStack>
                </Center>
            ) : (
                <VStack gap={4} py={6} align="stretch">
                    {messages.map((msg, idx) => (
                        <Flex
                            key={msg.message_id || idx}
                            justify={msg.sender === "user" ? "flex-end" : "center"}
                        >
                            <Box
                                className="markdown-body"
                                px={4}
                                py={2}
                                sx={{
                                    "& h1": {fontSize: "2xl", mt: 4, mb: 2, fontWeight: "bold"},
                                    "& h2": {fontSize: "xl", mt: 4, mb: 2, fontWeight: "semibold"},
                                    "& p": {mt: 2, mb: 2, color: "app.text.primary"},
                                    "& ul": {pl: 6, mt: 2, mb: 2},
                                    "& li": {mb: 1},
                                    "& pre": {
                                        background: "#1e1e1e",
                                        padding: "1em",
                                        borderRadius: "md",
                                        overflowX: "auto",
                                    },
                                    "& code": {
                                        background: "rgba(0,0,0,0.06)",
                                        borderRadius: "sm",
                                        px: "1",
                                        fontSize: "sm",
                                    },
                                }}
                            >
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{msg.content}</ReactMarkdown>
                            </Box>

                        </Flex>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default Response;
