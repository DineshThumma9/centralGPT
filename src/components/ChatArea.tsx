import { HStack, VStack } from "@chakra-ui/react";
import LLMModelChooser from "./LLMModelChooser";
import AvaterExpandable from "./AvaterExpandable";
import SendRequest from "./SendRequest";
import Response from "./Response";



const ChatArea = () => {
    return (
        <VStack
            flex="1"
            spacing={0}
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
                borderBottom="1px solid"
                borderColor="app.border"
                minH="70px"
            >
                <LLMModelChooser />
                <AvaterExpandable />
            </HStack>

            {/* SessionComponent Messages Area */}
            <Response />

            {/* Input Area */}
            <SendRequest />
        </VStack>
    );
};

export default ChatArea;