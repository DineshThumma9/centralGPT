import {Box, HStack, IconButton, Textarea,} from "@chakra-ui/react";
import {Send} from "lucide-react";
import {useRef, useState} from "react";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import useSessionStore from "../store/sessionStore.ts";
import {v4} from "uuid";
import {z} from "zod/v4";
import Message from "../entities/Message.ts";

const SendRequest = () => {
    const [input, setInput] = useState("");
    const {sending, setSending, shouldStream} = useSessionStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {tstMsgFunc, streamMessage} = useSessions();
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

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            if (shouldStream) {
                await streamMessage(messageContent);
            } else {
                await tstMsgFunc(messageContent);
            }

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

        const textarea = e.target;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = Math.min(scrollHeight, 120) + 'px';
    };

    return (
        <Box
            w="full"
            bg="rgba(10, 10, 20, 0.95)"
            backdropFilter="blur(20px)"
            py={4}
            px={4}
            borderTop="1px solid"
            borderColor="rgba(139, 92, 246, 0.2)"
            overflow={"auto"}
            css={{
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(139, 92, 246, 0.3)",
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
            >
                <HStack
                    bg="rgba(30, 30, 40, 0.9)"
                    backdropFilter="blur(10px)"
                    border="2px solid"
                    borderColor="rgba(139, 92, 246, 0.3)"
                    borderRadius="2xl"
                    px={4}
                    py={3}
                    gap={3}
                    alignItems="flex-end"
                    boxShadow="0 0 40px rgba(139, 92, 246, 0.2)"
                    _focusWithin={{
                        borderColor: "rgba(139, 92, 246, 0.6)",
                        boxShadow: "0 0 60px rgba(139, 92, 246, 0.3)",
                        transform: "translateY(-2px)"
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '2xl',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
                        zIndex: -1
                    }}
                >
                    <Textarea
                        ref={textareaRef}
                        resize="none"
                        minH="44px"
                        maxH="120px"
                        color="white"
                        border="none"
                        px={0}
                        py={2}
                        overflow="auto"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        fontSize="md"
                        lineHeight="1.5"
                        bg="transparent"
                        _placeholder={{color: "rgba(255, 255, 255, 0.5)"}}
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
                                backgroundColor: "rgba(139, 92, 246, 0.3)",
                                borderRadius: "3px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "transparent",
                            },
                        }}
                    />

                    <IconButton
                        aria-label="Send message"
                        onClick={handleSendMessage}
                        disabled={!input.trim() || sending}
                        size="md"
                        bg={input.trim() && !sending
                            ? "linear-gradient(135deg, #8B5CF6, #A855F7)"
                            : "rgba(100, 100, 120, 0.3)"
                        }
                        color="white"
                        borderRadius="xl"
                        transition="all 0.3s ease"
                        boxShadow={input.trim() && !sending
                            ? "0 0 20px rgba(139, 92, 246, 0.4)"
                            : "none"
                        }
                        _hover={{
                            transform: input.trim() && !sending ? "scale(1.1)" : "none",
                            boxShadow: input.trim() && !sending
                                ? "0 0 30px rgba(139, 92, 246, 0.6)"
                                : "none"
                        }}
                        _active={{
                            transform: input.trim() && !sending ? "scale(0.95)" : "none"
                        }}
                        _disabled={{
                            cursor: "not-allowed",
                            opacity: 0.4
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