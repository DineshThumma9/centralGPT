import {Box, HStack, IconButton, Textarea, Skeleton, VStack} from "@chakra-ui/react";
import {PauseIcon, Send} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import useSessionStore from "../store/sessionStore.ts";
import {v4} from "uuid";
import type {Message} from "../entities/Message.ts";
import MediaPDF from "./MediaPDF.tsx";
import {uploadDocument} from "../api/rag-api.ts";
import useMessage from "../hooks/useMessage.ts";
import {toaster} from "./ui/toaster.tsx";
import {useQuery} from "@tanstack/react-query";
import {API_BASE_URL} from "../api/apiInstance.ts";

const box = () => ({
    w: "full",
    bg: "bg.canvas",
    borderTop: `1px solid token(colors.border.muted)`,
    p: 3,
});

const hstack = () => ({
    alignItems: "flex-end", // Align items to bottom for better icon positioning
    borderColor: "border.subtle",
    borderRadius: "xl",
    px: 3,
    py: 2,
    gap: 3,
    bg: "bg.panel",
    backgroundColor: "bg.panel", // Explicit override
    backgroundImage: "none", // Override any gradients
    border: `1px solid ${"border.subtle"}`,
    boxShadow: "sm",
    _focusWithin: {
        borderColor: "border.emphasized",
        boxShadow: `0 0 0 1px ${"border.emphasized"}`,
    },
    transition: "all 0.2s ease",
    maxW: "4xl",
    mx: "auto",
    minH: "44px", // Minimum single line height
});

const txtarea = () => ({
    resize: "none" as const,
    minH: "20px", // Single line height
    maxH: "120px", // Allow more growth but still limited
    h: "20px", // Start with single line
    color: "fg",
    border: "none",
    px: 0,
    py: 0,
    lineHeight: "20px", // Consistent line height
    placeholder: "Type your message...",
    fontSize: "sm",
    bg: "transparent",
    background: "transparent", // Explicit override
    backgroundImage: "none", // Override any gradients
    backgroundAttachment: "initial",
    backgroundClip: "initial",
    backgroundColor: "transparent",
    overflowY: "hidden", // Hide scrollbar until needed
    _placeholder: {
        color: "fg.muted",
        fontSize: "sm"
    },
    _focus: {
        boxShadow: "none",
        outline: "none",
        bg: "transparent",
        background: "transparent",
        backgroundImage: "none",
    },
    _disabled: {
        bg: "transparent",
        background: "transparent",
        backgroundImage: "none",
    },
});

interface PollResponse {
    collection_name: string;
    status: string;
}

const SendRequest = () => {
    const [input, setInput] = useState("");
    const {sending, setSending, isStreaming} = useSessionStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {streamMessage, abortStream} = useMessage();
    const {addMessage, files, setFiles, context_id, context, current_session} =
        useSessionStore();

    const [isWaitingForIndexing, setIsWaitingForIndexing] = useState(false);
    const pendingMessageRef = useRef<string | null>(null);
    const hasShownReadyToaster = useRef(false);
    const loadingToastId = useRef<string | null>(null);

    const {data, isSuccess, isError, error} = useQuery<PollResponse, Error>({
        queryKey: ["status", context_id, context, current_session],
        queryFn: async () => {
            const res = await fetch(
                `${API_BASE_URL}/rag/status?context_id=${context_id}&context_type=${context}&session_id=${current_session}`
            );
            if (!res.ok) throw new Error("Failed to fetch status");
            return res.json();
        },
        enabled: isWaitingForIndexing,
        refetchInterval: isWaitingForIndexing ? 3000 : false,
        refetchIntervalInBackground: false,
    });

    useEffect(() => {
        if (isSuccess && data?.status === "ready" && !hasShownReadyToaster.current) {
            hasShownReadyToaster.current = true;
            setIsWaitingForIndexing(false);

            if (loadingToastId.current) {
                toaster.dismiss(loadingToastId.current);
                loadingToastId.current = null;
            }

            toaster.create({
                title: "Files Ready",
                description: "Your documents have been processed successfully!",
                type: "success",
            });

            if (pendingMessageRef.current) {
                streamMessage(pendingMessageRef.current);
                pendingMessageRef.current = null;
            }
        }
    }, [isSuccess, data, streamMessage]);

    // Reset textarea height when input is cleared
    useEffect(() => {
        if (!input && textareaRef.current) {
            textareaRef.current.style.height = "20px";
            textareaRef.current.style.overflowY = "hidden";
        }
    }, [input]);

    useEffect(() => {
        if (isError) {
            setIsWaitingForIndexing(false);
            pendingMessageRef.current = null;

            if (loadingToastId.current) {
                toaster.dismiss(loadingToastId.current);
                loadingToastId.current = null;
            }

            toaster.create({
                title: "File Processing Error",
                description: error.message,
                type: "error",
            });
        }
    }, [isError, error]);

    const handleSendMessage = async () => {
        if (!input.trim() || sending) return;

        const currentSession = useSessionStore.getState().current_session;
        if (!currentSession) {
            console.error("No session selected.");
            return;
        }

        const displayCurrentFiles = files.map((f) => f.name);
        const currentFiles = [...files];
        const messageContent = input.trim();

        setInput("");
        setFiles([]);

        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        if (textareaRef.current) {
            textareaRef.current.style.height = "20px";
            textareaRef.current.style.overflowY = "hidden";
        }

        const message: Message = {
            session_id: v4(),
            message_id: v4(),
            content: messageContent,
            sender: "user",
            timestamp: new Date().toISOString(),
            files: displayCurrentFiles,
        };

        addMessage(message);

        try {
            if (currentFiles.length > 0) {
                hasShownReadyToaster.current = false;
                const new_context_id = v4();
                useSessionStore.getState().setContextID(new_context_id);
                pendingMessageRef.current = messageContent;

                loadingToastId.current = toaster.create({
                    description: "Uploading and processing documents...",
                    type: "loading",
                    closable: true,
                });

                const res = await uploadDocument(
                    currentFiles,
                    currentSession,
                    new_context_id
                );

                if (res && res.status === 200) {
                    setIsWaitingForIndexing(true);
                } else {
                    throw new Error("File upload failed.");
                }
            } else {
                await streamMessage(messageContent);
            }
        } catch (err) {
            console.error("Error:", err);

            if (loadingToastId.current) {
                toaster.dismiss(loadingToastId.current);
                loadingToastId.current = null;
            }

            toaster.create({
                title: "Error",
                description:
                    err instanceof Error ? err.message : "An unexpected error occurred.",
                type: "error",
            });
            pendingMessageRef.current = null;
            setIsWaitingForIndexing(false);
            setSending(false);
        }
    };

    const handleKeyPress = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const textarea = e.target;

        // Reset height to get accurate scrollHeight
        textarea.style.height = "20px";

        // Calculate new height based on content
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 120; // Match maxH in txtarea styles
        const newHeight = Math.min(scrollHeight, maxHeight);

        // Apply the new height
        textarea.style.height = newHeight + "px";

        // Show scrollbar only when content exceeds max height
        textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    };

    return (
        <Box {...box()}>
            {/* Show loading skeleton when we're waiting for initial response */}
            {sending && !isStreaming && (
                <Box px={3} pb={2}>
                    <VStack gap={2} align="stretch">
                        <Skeleton height="16px" />
                        <Skeleton height="16px" width="80%" />
                        <Skeleton height="16px" width="60%" />
                    </VStack>
                </Box>
            )}
            
            <HStack {...hstack()}>
                <MediaPDF>
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        disabled={sending || isWaitingForIndexing}
                        {...txtarea()}
                        flex="1"
                    />
                </MediaPDF>

                <IconButton
                    aria-label={isStreaming ? "Stop streaming" : "Send message"}
                    onClick={isStreaming ? abortStream : handleSendMessage}
                    disabled={
                        isStreaming
                            ? false
                            : !input.trim() || sending || isWaitingForIndexing
                    }
                    size="sm"
                    bg="transparent"
                    color={
                        isStreaming ||
                        (input.trim() && !sending && !isWaitingForIndexing)
                            ? { base: "brand.700", _dark: "brand.600" }
                            : { base: "gray.400", _dark: "gray.600" }
                    }
                    borderRadius="md"
                    transition="all 0.2s ease"
                    _hover={{
                        bg: (isStreaming || (input.trim() && !sending && !isWaitingForIndexing))
                            ? { base: "brand.50", _dark: "brand.950" }
                            : "transparent",
                        transform:
                            isStreaming || (input.trim() && !sending)
                                ? "scale(1.05)"
                                : "none",
                        color: (isStreaming || (input.trim() && !sending && !isWaitingForIndexing))
                            ? { base: "brand.800", _dark: "brand.500" }
                            : { base: "gray.400", _dark: "gray.600" },
                    }}
                    _active={{
                        bg: (isStreaming || (input.trim() && !sending && !isWaitingForIndexing))
                            ? { base: "brand.100", _dark: "brand.900" }
                            : "transparent",
                        transform: "scale(0.95)",
                    }}
                    _disabled={{
                        cursor: "not-allowed",
                        opacity: 0.5,
                        bg: "transparent",
                        color: { base: "gray.300", _dark: "gray.700" },
                    }}
                >
                    {isStreaming ? <PauseIcon size={16}/> : <Send size={16}/>}
                </IconButton>
            </HStack>
        </Box>
    );
};

export default SendRequest;