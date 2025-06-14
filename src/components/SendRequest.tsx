import {
    Box, Button, FileUpload, Float,
    HStack,
    IconButton,
    Textarea,
    Menu, Portal,
    Text,
} from "@chakra-ui/react";
import {Send, Paperclip} from "lucide-react";
import {useState, useRef} from "react";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import {v4} from "uuid";
import {z} from "zod/v4";
import Message from "../entities/Message.ts";
import {HiUpload} from "react-icons/hi";
import {LuX} from "react-icons/lu";
import useSessionStore from "../store/sessionStore.ts";

const SendRequest = () => {
    const [input, setInput] = useState("");
    const {sending, setSending} = useSessionStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {tstMsgFunc,sendRequest,streamMessage} = useSessions();
    const {addMessage} = sessionStore();

    type MessageType = z.infer<typeof Message>;


    const handleSendMessage = async () => {
        if (!input.trim() || sending) return;

        const currentSession = sessionStore.getState().current_session;
        if (!currentSession) {
            console.error("No session selected.");
            return;
        }

        const message: MessageType = {
            session_id: v4(),
            message_id: v4(),
            content: input.trim(),
            sender: "user",
            timestamp: new Date().toISOString()
        };

        addMessage(message);

        try {
            setSending(true);
            const messageContent = input.trim();
            setInput("");

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            await streamMessage(messageContent);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);

        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = Math.min(scrollHeight, 120) + 'px';
    };

    return (
        <Box
            w="full"
            bg="app.bg"
            py={4}
            px={4}
            overflow={"auto"}
            css={{
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                },
            }}
        >
            <Box
                maxW="1000px"
                mx="auto"
                w="full"
                overflow={"auto"}
                css={{
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                    },
                }}

            >
                {/* Input Container */}
                <HStack
                    bg="white"
                    borderRadius="xl"
                    px={4}
                    py={3}
                    gap={3}
                    alignItems="flex-end"
                    boxShadow="sm"
                    _focusWithin={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                    }}
                    transition="all 0.2s"
                >
                    {/* Media Upload Button */}


                    {/* Text Input */}
                    <Textarea
                        ref={textareaRef}
                        resize="none"
                        minH="44px"
                        maxH="120px"
                        color="black"
                        border="none"
                        px={0}
                        py={2}
                        overflow="auto" // ✅ Enables scroll when needed
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        fontSize="md"
                        lineHeight="1.5"
                        _placeholder={{color: "gray.400"}}
                        _focus={{
                            boxShadow: "none",
                            outline: "none"
                        }}
                        disabled={sending}
                        css={{
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0, 0, 0, 0.2)",
                                borderRadius: "3px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "transparent",
                            },
                        }}
                    />

                    {/* Send Button */}
                    <IconButton
                        aria-label="Send message"
                        onClick={handleSendMessage}
                        disabled={!input.trim() || sending}
                        size="md"
                        bg={input.trim() && !sending ? "blue.500" : "gray.300"}
                        color="white"
                        borderRadius="lg"
                        transition="all 0.2s"
                        _hover={{
                            bg: input.trim() && !sending ? "blue.600" : "gray.300",
                            transform: input.trim() && !sending ? "scale(1.05)" : "none"
                        }}
                        _active={{
                            transform: input.trim() && !sending ? "scale(0.95)" : "none"
                        }}
                        _disabled={{
                            cursor: "not-allowed",
                            opacity: 0.6
                        }}
                    >
                        <Send size={18}/>
                    </IconButton>
                </HStack>

            </Box>
        </Box>
    );
};

export default SendRequest;