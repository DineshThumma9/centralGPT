import { Box, Text, VStack, Center } from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import type Message from "../entities/Message.ts";
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css'; // or any other theme you like


const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const scrollRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        // Subscribe to store changes
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        // Get initial state
        setMessages(sessionStore.getState().messages);

        return unsubscribe;


    }, []);


    useEffect(() => {
        const isNearBottom =
            scrollRef.current &&
            scrollRef.current.getBoundingClientRect().top <
            window.innerHeight - 100;

        if (isNearBottom) {
            scrollRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);


    return (
        <Box

            flex="1"
            w="full"
            overflowY="auto"
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
                    <VStack  gap={4}>
                        <Text
                            fontSize="xl"
                            color="app.text.secondary"
                            fontWeight="medium"
                        >
                            Start a conversation
                        </Text>
                        <Text
                            fontSize="sm"
                            color="app.text.muted"
                            textAlign="center"
                            maxW="md"
                        >
                            Choose a model and start chatting. Your messages will appear here.
                        </Text>
                    </VStack>
                </Center>
            ) : (
                <VStack gap={4} align="stretch" p={6}>
                    {messages.map((msg, idx) => (
                        <Box
                            key={msg.message_id || idx}
                            alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                            bg={msg.sender === "user" ? "app.accent" : "app.bg"}
                            color={msg.sender === "user" ? "white" : "app.text.primary"}
                            px={4}
                            py={4}
                            maxW={msg.sender === "user" ? "70%" : "100%"}

                            maxH={"100%"}
                            boxSize={"auto"}
                            // shadow="sm"
                            borderRadius={msg.sender === "user" ? "40px" : "Opx"}
                            borderColor={"transparent"}
                            _hover={{
                                transform: "translateY(-1px)",
                                shadow: "md"
                            }}
                            transition="all 0.2s ease-in-out"
                        >
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {msg.content}
                            </ReactMarkdown>

                        </Box>
                    ))}
                    <div ref={scrollRef}></div>
                </VStack>
            )}
        </Box>
    );
};

export default Response;