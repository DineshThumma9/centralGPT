import {
    Box,
    Center,
    Heading,
    VStack,
    Flex,
    Avatar,
    Text,
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import {Bot} from "lucide-react";

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
            h="100%"
            overflowY="auto"
            overflowX="hidden"
            w="full"
            bg="app.bg"
            position="relative"
            css={{
                '&::-webkit-scrollbar': {
                    width: '6px',
                    position: 'absolute',
                    right: 0,
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                    '&:hover': {
                        background: 'rgba(0,0,0,0.4)',
                    }
                },
            }}
        >
            {messages.length === 0 ? (
                <Center h="full" px={4}>
                    <VStack gap={4} textAlign="center">
                        <Box>
                            <Bot size={48} color="gray"/>
                        </Box>
                        <Heading
                            fontSize="xl"
                            color="gray.600"
                            fontWeight="medium"
                        >
                            Start a conversation
                        </Heading>
                        <Text
                            fontSize="md"
                            color="gray.500"
                            maxW="400px"
                            lineHeight="1.5"
                        >
                            Choose a model and start chatting. Your messages will appear here.
                        </Text>
                    </VStack>
                </Center>
            ) : (
                <VStack
                    gap={0}
                    align="stretch"
                    w="full"
                    pb={4}
                >
                    {messages.map((msg, idx) => (
                        <Box
                            key={msg.message_id || idx}
                            w="full"
                            py={4}
                            px={4}
                            bg={msg.sender === "user" ? "transparent" : "gray.50"}
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <Flex
                                maxW="1200px"
                                mx="auto"
                                gap={4}
                                align="flex-start"
                            >
                                {/* Avatar */}
                                <Box flexShrink={0}>
                                    {msg.sender === "user" ? (
                                        <Avatar.Root size="sm" border="0px">
                                            <Avatar.Fallback name="user" />
                                            <Avatar.Image
                                                zIndex={2}
                                                borderRadius="full"
                                                _hover={{
                                                    borderRadius: "full",
                                                }}
                                            />
                                        </Avatar.Root>
                                    ) : (
                                        <Avatar.Root size="sm" border="0px">
                                            <Avatar.Fallback name="bot" />
                                            <Avatar.Image
                                                zIndex={2}
                                                borderRadius="full"
                                                _hover={{
                                                    borderRadius: "full",
                                                }}
                                            />
                                        </Avatar.Root>
                                    )}
                                </Box>

                                {/* Message Content */}
                                <Box
                                    flex="1"
                                    minW={0}
                                    pt={1}
                                >
                                    {msg.sender === "user" ? (
                                        <Text
                                            color="gray.800"
                                            fontSize="md"
                                            lineHeight="1.6"
                                            whiteSpace="pre-wrap"
                                            wordBreak="break-word"
                                        >
                                            {msg.content}
                                        </Text>
                                    ) : (
                                        <Box
                                            className="ai-response"
                                            css={{
                                                "& p": {
                                                    // color: "gray.800",
                                                    fontSize: "md",
                                                    lineHeight: "1.6",
                                                    mb: 3,
                                                    wordBreak: "break-word",
                                                    "&:last-child": { mb: 0 },
                                                },
                                            }}
                                        >
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </Box>
                                    )}
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default Response;