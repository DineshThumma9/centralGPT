import {Box, Flex, VStack} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import useSessionStore from "../store/sessionStore.ts";
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import EmptyState from "./EmptyState.tsx";
import UserRequest from "./UserRequest.tsx";
import AIResponse from "./AIResponse.tsx";
import Empty from "./Empty.tsx";

const backgroundColor = "app.bg";

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
                h="100%"
                w="full"
                overflowY="auto"
                bg={backgroundColor}
                css={{
                    '&::-webkit-scrollbar': {width: '6px'},
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '3px',
                    },
                }}
            >
                <Empty />
                {messages.length === 0 ? (
                    <EmptyState/>
                ) : (
                    <VStack gap={8} align="stretch" w="full" maxW="4xl" mx="auto" py={6}>
                        {messages.map((msg, idx) => (
                            <Flex
                                key={idx}
                                justify={msg.sender === "user" ? "flex-end" : "flex-start"}
                                px={6}
                            >
                                {msg.sender === "user" ? (
                                    <UserRequest msg={msg}/>
                                ) : (
                                    <AIResponse msg={msg} idx={idx}/>
                                )}
                            </Flex>
                        ))}
                    </VStack>
                )
                }
            </Box>
        )
            ;
    }
;

export default Response;
