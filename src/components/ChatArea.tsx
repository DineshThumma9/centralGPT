// src/components/ChatArea.tsx
import {Box, HStack, VStack} from "@chakra-ui/react";
import LLMModelChooser from "./LLMModelChooser";
import AvaterExpandable from "./AvaterExpandable";
import SendRequest from "./SendRequest";
import Response from "./Response";
import type {Message} from "../entities/Message.ts";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";


const chatAreaVstack = {
    flex: "1",
    gap: "0",
    h: "100vh",
    bg: "linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
    overflow: "hidden",
    position: "relative",

}


const caHeaaderBox = {
    w: "full",
    bg: "rgba(26, 11, 46, 0.9)",
    backdropFilter: "blur(10px)",
    borderColor: "purple.600",
    zIndex: 100,
    flexShrink: 0,

}


const bodyBox = {

    flex: "1",
    w: "full",
    overflow: "hidden",
    position: "relative",
    bg: "transparent",
}

const footerBox = {

    w: "full",
    backdropFilter: "blur(10px)",
    flexShrink: 0,
    zIndex: 100,
}


const Hstackprops = {
    w :"full",
    justifyContent: "space-between",
    alignItems: "center",
    p: 4,
    minH: "70px",
    maxW: "1200px",
    mx: "auto",
}




const ChatArea = () => {
    const [, setMessages] = useState<Message[]>([]);
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
            {...chatAreaVstack}
        >

            <Box
                {...caHeaaderBox}
            >
                <HStack
                    {...Hstackprops}
                >
                    <LLMModelChooser/>

                    <AvaterExpandable/>
                </HStack>
            </Box>


            <Box
                {...bodyBox}
            >
                <Response/>
            </Box>

            <Box
                {...footerBox}
            >
                <SendRequest/>
            </Box>

            <div ref={scrollRef}></div>
        </VStack>
    );
};

export default ChatArea;

