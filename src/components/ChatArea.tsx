import { HStack, VStack } from "@chakra-ui/react";
import LLMModelChooser from "./LLMModelChooser";
import AvaterExpandable from "./AvaterExpandable";
import SendRequest from "./SendRequest";
import Response from "./Response";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

const ChatArea = () => {
    return (
        <>
            <VStack flex="1" spacing={4} h="100vh" overflowY="auto" color="gray.700" px={4}>

                <HStack w="full" justifyContent="space-between" alignItems="center" py={2}>
                    <LLMModelChooser />
                    <AvaterExpandable />
                </HStack>

                <Response />

                <SendRequest />

            </VStack>
        </>
    );
};

export default ChatArea;
