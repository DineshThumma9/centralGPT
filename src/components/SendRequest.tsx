import {Box, HStack, IconButton, Input, Group} from "@chakra-ui/react";
import {Search, Send} from "lucide-react";
import {useState} from "react";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import type Message from "../entities/Message.ts";
import { v4 } from "uuid"

const SendRequest = () => {
    const [input, setInput] = useState("");
    const {tstMsgFunc} = useSessions();

    const {addMessage} = sessionStore()

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        try {
            console.log(await tstMsgFunc(input.trim()));
            setInput(""); // Clear input after sending
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
               const message: Message = {
                session_id: v4(),
                message_id: v4(),
                content: input,
                sender: "user", // Matches the expected type
                timestamp: new Date().toISOString()
            };
            addMessage(message)
            handleSendMessage();
        }
    };

    return (
        <Box
            w="full"
            p={4}
            bg="app.bg"
            border = {"0px"}
            minH="80px"
        >
            <HStack alignItems="center" gap={3}>
                <Group flex="1">
                    <Box
                        position="absolute"
                        left={3}
                        top="50%"
                        transform="translateY(-50%)"
                        pointerEvents="none"
                        zIndex={1}
                    >
                        <Search color="var(--chakra-colors-app-text-muted)" size={16}/>
                    </Box>
                    <Input
                        borderRadius="full"
                        type="text"
                        placeholder="Type your query..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        bg="grey.600"
                        borderColor="app.border"
                        color="app.text.primary"
                        pl={10}
                        css={{
                            "&::placeholder": {
                                color: "var(--chakra-colors-app-text-muted)"
                            },
                            "&:hover": {
                                borderColor: "var(--chakra-colors-app-accent)"
                            },
                            "&:focus": {
                                borderColor: "var(--chakra-colors-app-accent)",
                                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)"
                            }
                        }}
                        size="lg"
                    />
                </Group>

                <IconButton
                    aria-label="Send message"
                    colorPalette="brand"
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    size="lg"
                    borderRadius="full"
                    css={{
                        "&:hover": {
                            transform: "scale(1.05)"
                        },
                        "&:active": {
                            transform: "scale(0.95)"
                        },
                        transition: "all 0.2s"
                    }}
                >
                    <Send />
                </IconButton>
            </HStack>
        </Box>
    );
};

export default SendRequest;