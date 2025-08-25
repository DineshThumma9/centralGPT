import { Box, HStack, IconButton, Textarea } from "@chakra-ui/react";
import { PauseIcon, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSessionStore from "../store/sessionStore.ts";
import { v4 } from "uuid";
import type { Message } from "../entities/Message.ts";
import MediaPDF from "./MediaPDF.tsx";
import { uploadDocument } from "../api/rag-api.ts";
import useMessage from "../hooks/useMessage.ts";
import { toaster } from "./ui/toaster.tsx";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../api/apiInstance.ts";
import useTheme from "../hooks/useTheme.ts";

const box = (themeColors: any) => ({
  w: "full",
  bg: "transparent", // Transparent parent box to blend with theme
  borderTop: `1px solid ${themeColors.border.subtle}`, // Add subtle border
  py: 1, // Minimal padding for maximum reading space
  px: 2, // Reduced horizontal padding
  overflow: "auto" as const,
});

const hstack = (themeColors: any) => ({
  backdropFilter: "blur(10px)",
  border: "1px solid",
  alignItems: "center",
  borderColor: themeColors.border.default,
  borderRadius: "lg",
  marginLeft: "3px",
  px: 3,
  py: 2,
  gap: 2,
  bg: themeColors.background.card, // Use theme card background
  boxShadow: themeColors.shadow.sm,
  _focusWithin: {
    borderColor: themeColors.border.focus,
    boxShadow: themeColors.shadow.md,
    transform: "translateY(-1px)",
  },
  transition: "all 0.2s ease",
});

const txtarea = (themeColors: any) => ({
  resize: "none" as const,
  minH: "18px", // Even smaller default height
  maxH: "100px", // Reduced max height for more reading space
  color: themeColors.text.primary,
  border: "none",
  px: 0,
  py: 0.5, // Reduced padding
  overflow: "auto" as const,
  placeholder: "Type your message...",
  fontSize: "sm",
  bg: "transparent",
  _placeholder: { 
    color: themeColors.text.muted, // Use theme muted text color
    fontSize: "sm"
  },
  _focus: {
    boxShadow: "none",
    outline: "none",
  },
});

interface PollResponse {
  collection_name: string;
  status: string;
}

const SendRequest = () => {
  const [input, setInput] = useState("");
  const { sending, setSending, isStreaming } = useSessionStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { streamMessage, abortStream } = useMessage();
  const { addMessage, files, setFiles, context_id, context, current_session } =
    useSessionStore();
    const { themeColors } = useTheme();

  const [isWaitingForIndexing, setIsWaitingForIndexing] = useState(false);
  const pendingMessageRef = useRef<string | null>(null);
  const hasShownReadyToaster = useRef(false);
  const loadingToastId = useRef<string | null>(null);

  const { data, isSuccess, isError, error } = useQuery<PollResponse, Error>({
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
      textareaRef.current.style.height = "auto";
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
    textarea.style.height = "20px"; // Reset to minimum height
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"; // Max 120px expansion
  };

  return (
    <Box {...box(themeColors)}>
      <Box maxW="4xl" mx="auto" px={1}> {/* Match Response component max width */}
        <HStack {...hstack(themeColors)}>
          <MediaPDF>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={sending || isWaitingForIndexing}
              {...txtarea(themeColors)}
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
            bg={
              isStreaming ||
              (input.trim() && !sending && !isWaitingForIndexing)
                ? themeColors.green.dark // Use green dark color
                : themeColors.background.hover // Use hover background
            }
            color={
              isStreaming ||
              (input.trim() && !sending && !isWaitingForIndexing)
                ? "white"
                : themeColors.text.muted
            }
            borderRadius="md"
            transition="all 0.2s ease"
            boxShadow={
              isStreaming || (input.trim() && !sending)
                ? themeColors.shadow.sm
                : "none"
            }
            _hover={{
              transform:
                isStreaming || (input.trim() && !sending)
                  ? "scale(1.05)"
                  : "none",
              bg:
                isStreaming || (input.trim() && !sending)
                  ? themeColors.green.darker
                  : themeColors.background.hover,
              boxShadow:
                isStreaming || (input.trim() && !sending)
                  ? themeColors.shadow.md
                  : "none",
            }}
            _active={{
              transform:
                isStreaming || (input.trim() && !sending)
                  ? "scale(0.95)"
                  : "none",
            }}
            _disabled={{
              cursor: "not-allowed",
              opacity: 0.5,
              bg: themeColors.background.hover, // Use hover background instead
              color: themeColors.text.muted,
            }}
          >
            {isStreaming ? <PauseIcon size={16} /> : <Send size={16} />}
          </IconButton>
        </HStack>
      </Box>
    </Box>
  );
};

export default SendRequest;