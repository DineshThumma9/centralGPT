import {Box, HStack, VStack} from "@chakra-ui/react";
import LLMModelChooser from "./LLMModelChooser";
import AvaterExpandable from "./AvaterExpandable";
import SendRequest from "./SendRequest";
import Response from "./Response";
import type {Message} from "../entities/Message.ts";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";

const ChatArea = () => {
    const [,setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement | null>(null);

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
        <VStack
            flex="1"
            gap="0"
            h="100vh"
            bg="app.bg"
            color="app.text.primary"
            overflow="hidden"
            position="relative"
        >
            {/* Fixed Header */}
            <Box
                w="full"
                bg="app.bg"
                borderBottom="1px solid"
                borderColor="gray.200"
                zIndex={100}
                flexShrink={0}
            >
                <HStack
                    w="full"
                    justifyContent="space-between"
                    alignItems="center"
                    p={4}
                    minH="70px"
                    maxW="1200px"
                    mx="auto"
                >
                    <LLMModelChooser/>
                    <AvaterExpandable/>
                </HStack>
            </Box>

            {/* Messages Container - Takes remaining space */}
            <Box
                flex="1"
                w="full"
                overflow="hidden"
                position="relative"
            >
                <Response/>
            </Box>

            {/* Fixed Input Area */}
            <Box
                w="full"
                bg="app.bg"
                borderTop="1px solid"
                borderColor="gray.200"
                flexShrink={0}
                zIndex={100}
            >
                <SendRequest/>
            </Box>

            <div ref={scrollRef}></div>
        </VStack>
    );
};

export default ChatArea;