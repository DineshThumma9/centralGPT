// src/components/ChatArea.tsx
import {Box, HStack, VStack} from "@chakra-ui/react";
import LLMModelChooser from "./LLMModelChooser";
import AvaterExpandable from "./AvaterExpandable";
import SendRequest from "./SendRequest";
import Response from "./Response";
import {useEffect, useRef} from "react";
import sessionStore from "../store/sessionStore.ts";
import { useColorMode } from "../contexts/ColorModeContext";

const ChatArea = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { colors } = useColorMode();

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe(() => {
            // Message updates handled by Response component
        });

        return unsubscribe;
    }, []);

    const chatAreaVstack = {
        flex: "1",
        gap: "0",
        h: "100vh",
        bg: colors.background.body,
        overflow: "hidden",
        position: "relative",
    }

    const caHeaaderBox = {
        w: "full",
        bg: "transparent", // Fully transparent for better readability
        backdropFilter: "blur(6px)", // Even less blur for more transparency
        borderBottom: `1px solid ${colors.border.secondary}`, // Use secondary border
        zIndex: 100,
        flexShrink: 0,
        py: 0, // No padding for maximum reading space
    }

    const bodyBox = {
        flex: "1",
        w: "full",
        overflow: "hidden",
        position: "relative",
        bg: colors.background.body, // Use theme background
        minH: 0, // Allow flexbox to shrink properly
    }

    const footerBox = {
        w: "full",
        bg: "transparent", // Transparent to blend with theme
        backdropFilter: "blur(6px)", // Less blur for more transparency
        borderTop: `1px solid ${colors.border.secondary}`, // Subtle border
        flexShrink: 0,
        zIndex: 100,
        py: 0, // No vertical padding for maximum reading space
    }

    const Hstackprops = {
        w: "full",
        justifyContent: "flex-start", // Align items to the left
        alignItems: "center",
        px: 1, // Minimal padding for maximum content space
        minH: "40px", // Much smaller header for more reading space
        maxW: "1200px",
        mx: "auto",
        gap: 2, // Further reduced gap for more compact layout
    }


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
                    
                    {/* Spacer to push avatar to the right */}
                    <Box flex="1" />

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

