import {HStack, VStack} from "@chakra-ui/react";
import LLMModelChooser from "../src/components/LLMModelChooser";
import AvaterExpandable from "../src/components/AvaterExpandable";
import SendRequest from "../src/components/SendRequest";
import Response from "../src/components/Response";
import type {Message} from "../src/entities/Message.ts";
import {useEffect, useState} from "react";
import sessionStore from "../src/store/sessionStore.ts";


const GitArea = () => {


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

            {/* SessionComponent Messages Area */}
            <Response/>

            {/* Input Area */}


            {
                messages.length == 0 &&
                <SendRequest/>
            }

        </VStack>
    );
};

export default GitArea;