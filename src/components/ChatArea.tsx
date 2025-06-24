// src/components/ChatArea.tsx
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
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        setMessages(sessionStore.getState().messages);
        return unsubscribe;
    }, []);

    return (
        <VStack
            flex="1"
            gap="0"
            h="100vh"
            bg="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"
            // color="white"
            overflow="hidden"
            position="relative"
        >
            {/* Fixed Header */}
            <Box
                w="full"
                bg="rgba(26, 11, 46, 0.9)"
                backdropFilter="blur(10px)"
                borderBottom="1px solid"
                borderColor="purple.600"
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

            {/* Messages Container */}
            <Box
                flex="1"
                w="full"
                overflow="hidden"
                position="relative"
                bg="transparent"
            >
                <Response/>
            </Box>

            {/* Fixed Input Area */}
            <Box
                w="full"
                bg="rgba(26, 11, 46, 0.9)"
                backdropFilter="blur(10px)"
                borderTop="1px solid"
                borderColor="purple.600"
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

// ===============================================
