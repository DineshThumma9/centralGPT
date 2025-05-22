import { Box, HStack, IconButton, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { FaPaperPlane } from "react-icons/fa";
import { useState } from "react";
import useSessions from "../hooks/useSessions.ts";

const SendRequest = () => {
    const [input, setInput] = useState("");
    const { sendRequest } = useSessions();

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        try {
            await sendRequest(input.trim());
            setInput(""); // Clear input after sending
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box
            w="full"
            p={4}
            bg="app.card.bg"
            borderTop="1px solid"
            borderColor="app.border"
            minH="80px"
        >
            <HStack alignItems="center" spacing={3}>
                <InputGroup flex="1">
                    <InputLeftElement pointerEvents="none">
                        <Search2Icon color="app.text.muted" />
                    </InputLeftElement>
                    <Input
                        borderRadius="full"
                        type="text"
                        placeholder="Type your query..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        bg="app.bg"
                        borderColor="app.border"
                        color="app.text.primary"
                        _placeholder={{
                            color: "app.text.muted"
                        }}
                        _hover={{
                            borderColor: "app.accent"
                        }}
                        _focus={{
                            borderColor: "app.accent",
                            boxShadow: `0 0 0 1px var(--chakra-colors-brand-500)`
                        }}
                        size="lg"
                    />
                </InputGroup>

                <IconButton
                    aria-label="Send message"
                    icon={<FaPaperPlane />}
                    colorScheme="brand"
                    onClick={handleSendMessage}
                    isDisabled={!input.trim()}
                    size="lg"
                    borderRadius="full"
                    _hover={{
                        transform: "scale(1.05)"
                    }}
                    _active={{
                        transform: "scale(0.95)"
                    }}
                    transition="all 0.2s"
                />
            </HStack>
        </Box>
    );
};

export default SendRequest;