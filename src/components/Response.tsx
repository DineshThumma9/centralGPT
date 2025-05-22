import { Box, Text, VStack, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import sessionStore from "../store/sessionStore.ts";
import type Message from "../entities/Message.ts";

const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Subscribe to store changes
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        // Get initial state
        setMessages(sessionStore.getState().messages);

        return unsubscribe;
    }, []);

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
                    <VStack spacing={4}>
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
                <VStack spacing={4} align="stretch" p={6}>
                    {messages.map((msg, idx) => (
                        <Box
                            key={msg.message_id || idx}
                            alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                            bg={msg.role === "user" ? "app.accent" : "app.card.bg"}
                            color={msg.role === "user" ? "white" : "app.text.primary"}
                            px={4}
                            py={3}
                            borderRadius="xl"
                            maxW="75%"
                            shadow="sm"
                            border="1px solid"
                            borderColor={msg.role === "user" ? "transparent" : "app.border"}
                            _hover={{
                                transform: "translateY(-1px)",
                                shadow: "md"
                            }}
                            transition="all 0.2s ease-in-out"
                        >
                            <Text fontSize="sm" lineHeight="1.6">
                                {msg.content}
                            </Text>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default Response;