import {Box, Flex, VStack} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import useSessionStore from "../store/sessionStore.ts";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import EmptyState from "./EmptyState.tsx";
import UserRequest from "./UserRequest.tsx";
import AIResponse from "./AIResponse.tsx";
// import Empty from "./Empty.tsx";

const backgroundColor = "linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)";


const box = {

    h: "100%",
    w: "full",
    overflowY: "auto",
    overflowX: "hidden",// Prevent horizontal scrolling
    bg: {backgroundColor},
    css: {
        '&::-webkit-scrollbar': {width: '6px'},
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(147, 51, 234, 0.3)',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
        }
    }
}

const vstack = {
    gap: 6,
    align: "stretch",
    w: "full",
    maxW: "4xl",
    mx: "auto",
    px: 4,

}



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
            <EmptyState/>
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