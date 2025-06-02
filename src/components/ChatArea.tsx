import {Box, HStack, VStack} from "@chakra-ui/react";
import LLMModelChooser from "./LLMModelChooser";
import AvaterExpandable from "./AvaterExpandable";
import SendRequest from "./SendRequest";
import Response from "./Response";
import type {Message} from "../entities/Message.ts";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";


const ChatArea = () => {


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


    return (

        <VStack
            flex="1"
            gap={"0"}
            h="100vh"
            bg="app.bg"
            color="app.text.primary"
            overflow="hidden"
        >
            {/* Header */}
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                p={4}
                bg="app.bg"
                border={"0px"}
                margin={"0px"}

                borderBottom="1px solid"
                borderColor="app.bg"
                minH="70px"
            >
                <LLMModelChooser/>
                <AvaterExpandable/>
            </HStack>

            <Box
                flex="1"
                height={"full"}
                overflowY="auto"
                w="full"
            >
                {/* SessionComponent Messages Area */}
                <Response/>

                {/* Input Area */}

                <div ref={scrollRef}></div>

                <SendRequest/>
            </Box>


        </VStack>
    );
};

export default ChatArea;