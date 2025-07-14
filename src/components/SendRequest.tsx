import {Box, HStack, IconButton, Textarea, VStack,} from "@chakra-ui/react";
import {Send} from "lucide-react";
import {useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import useSessionStore from "../store/sessionStore.ts";
import {v4} from "uuid";
import type { Message} from "../entities/Message.ts";
import MediaPDF from "./MediaPDF.tsx";
import {uploadDocument} from "../api/rag-api.ts";
import useMessage from "../hooks/useMessage.ts";

const box = {
    w: "full",
    backdropFilter: "blur(20px)",
    py: 4,
    px: 4,
    overflow: "auto" as const,
}

const hstack = {
    backdropFilter: "blur(10px)",
    border: "2px solid",
    alignItems: "flex-start",
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: "2xl",
    marginLeft: "3px",
    px: 2,
    py: 2,
    gap: 1,
    boxShadow: "0 0 40px rgba(139, 92, 246, 0.2)",
    _focusWithin: {
        borderColor: "rgba(139, 92, 246, 0.6)",
        boxShadow: "0 0 60px rgba(139, 92, 246, 0.3)",
        transform: "translateY(-2px)"
    },
    transition: "all 0.3s ease",
    position: "relative" as const,
    _before: {
        content: '""',
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '2xl',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
        zIndex: -1,
    }
}

const txtarea = {
    resize: "none" as const,
    minH: "44px",
    maxH: "120px",
    color: "white",
    border: "none",
    px: 0,
    py: 2,
    overflow: "auto" as const,
    placeholder: "Type your message...",
    fontSize: "md",
    bg: "transparent",
    _placeholder: {color: "rgba(255, 255, 255, 0.5)"},
    _focus: {
        boxShadow: "none",
        outline: "none"
    },
}

const SendRequest = () => {
    const [input, setInput] = useState("");
    const {sending, setSending} = useSessionStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {streamMessage} = useMessage();
    const {addMessage, files, setFiles} = sessionStore();


    console.log(`Sending : ${sending}`)

    const handleSendMessage = async () => {
        if (!input.trim() || sending) return;

        console.log("Entered message", input.trim())
        const currentSession = sessionStore.getState().current_session;
        if (!currentSession) {
            console.error("No session selected.");
            return;
        }

        // Create a copy of current files before clearing
        const displayCurrentFiles = []
        for(const file of files){
            displayCurrentFiles.push(file.name)
        }
        const currentFiles = [...files]
        const messageContent = input.trim();

        // Clear input and files IMMEDIATELY
        setInput("");
        setFiles([]);

        // Clear the file input element
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        const message: Message = {
            session_id: v4(),
            message_id: v4(),
            content: messageContent,
            sender: "user",
            timestamp: new Date().toISOString(),
            files: displayCurrentFiles.length > 0 ? displayCurrentFiles : []
        };

        // Add message to store
        addMessage(message);

        try {
            setSending(true);

            // Handle file upload if files exist
            if (currentFiles.length > 0) {
                const new_context_id = v4();
                useSessionStore.getState().setContextID(new_context_id);
                 await uploadDocument(currentFiles, currentSession, new_context_id);

            }

            await streamMessage(messageContent);

        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log("Enter has been pressed")
            await handleSendMessage();
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
        <Box {...box}>
            <Box maxW="1000px" mx="auto">
                <VStack {...hstack}>
                    <HStack w="full" justifyContent="space-between">
                        <MediaPDF>
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                disabled={sending}
                                {...txtarea}
                                maxH={"80px"}
                            />
                        </MediaPDF>

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
                </VStack>
            </Box>
        </Box>
    );
};

export default SendRequest;