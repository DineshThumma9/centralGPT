import { Box, HStack, IconButton, Textarea, VStack } from "@chakra-ui/react";
import { PauseIcon, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import sessionStore from "../store/sessionStore.ts";
import useSessionStore from "../store/sessionStore.ts";
import { v4 } from "uuid";
import type { Message } from "../entities/Message.ts";
import MediaPDF from "./MediaPDF.tsx";
import { uploadDocument } from "../api/rag-api.ts";
import useMessage from "../hooks/useMessage.ts";
import { toaster } from "./ui/toaster.tsx";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../api/apiInstance.ts";

const box = {
  w: "full",
  backdropFilter: "blur(20px)",
  py: 4,
  px: 4,
  overflow: "auto" as const,
};

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
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
  position: "relative" as const,
  _before: {
    content: '""',
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "2xl",
    background:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))",
    zIndex: -1,
  },
};

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
  _placeholder: { color: "rgba(255, 255, 255, 0.5)" },
  _focus: {
    boxShadow: "none",
    outline: "none",
  },
};

const SendRequest = () => {
  const [input, setInput] = useState("");
  const { sending, setSending, isStreaming } = useSessionStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { streamMessage, abortStream } = useMessage();
  const [sendingFiles, setSendingFiles] = useState(false);
  const [waitingForIndexing, setWaitingForIndexing] = useState(false);
  const { addMessage, files, setFiles, context_id, context, current_session } = sessionStore();

  // FIX: Only poll when we have files being processed
  const shouldPoll= waitingForIndexing && context === "notes" && context_id !== null;

  const { data, refetch } = useQuery({
    queryKey: ["status", context_id, context, current_session],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/rag/status?context_id=${context_id}&context_type=${context}&session_id=${current_session}`
      );
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    },
    refetchInterval: shouldPoll ? 2000 : false, // Only poll when needed
    refetchIntervalInBackground: false,
    enabled: shouldPoll, // Only enabled when we need to poll
  });

  console.log("Status data:", data);

  // FIX: Better status handling
  useEffect(() => {
    if (waitingForIndexing && data?.status === "ready") {
      setWaitingForIndexing(false);
      toaster.create({
        title: "Files Ready",
        description: "Your documents have been processed successfully!",
        type: "success",
      });
    } else if (waitingForIndexing && data?.status === "indexing") {
      toaster.create({
        description: "Processing documents...",
        type: "loading",
          closable:true
      });
    }
  }, [data?.status, waitingForIndexing]);

  const handleSendMessage = async () => {
    if (!input.trim() || sending) return;

    const currentSession = sessionStore.getState().current_session;
    if (!currentSession) {
      console.error("No session selected.");
      return;
    }

    const displayCurrentFiles = files.map((f) => f.name);
    const currentFiles = [...files];
    const messageContent = input.trim();

    setInput("");
    setFiles([]);

    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    // Reset textarea height
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
        const new_context_id = v4();
        useSessionStore.getState().setContextID(new_context_id);
        setSendingFiles(true);
        setWaitingForIndexing(true);

        const res = await uploadDocument(
          currentFiles,
          currentSession,
          new_context_id
        );

        if (res && res.status === 200) {
          // FIX: Wait for indexing to complete before sending message
          toaster.create({
            title: "Upload Successful",
            description: "Please wait while we process your documents...",
            type: "success",
          });

          // Don't send message immediately, wait for status to be ready
          // The useEffect will handle sending the message when ready
        } else {
          toaster.create({
            title: "File Processing Error",
            description: "Something went wrong while processing files.",
            type: "error",
          });
          setWaitingForIndexing(false);
        }
      } else {
        // No files, send message immediately
        await streamMessage(messageContent);
      }
    } catch (error) {
      console.error("Error:", error);
      toaster.create({
        title: "File Upload Error",
        description: "Error occurred while processing files.",
        type: "error",
      });
      setWaitingForIndexing(false);
    } finally {
      setSendingFiles(false);
      setSending(false);
    }
  };

  // FIX: Send message when indexing is complete
  useEffect(() => {
    if (data?.status === "ready" && waitingForIndexing) {
      const sendDelayedMessage = async () => {
        try {
          const lastMessage = sessionStore.getState().messages.slice(-1)[0];
          if (lastMessage && lastMessage.sender === "user") {
            await streamMessage(lastMessage.content);
          }
        } catch (error) {
          console.error("Error sending delayed message:", error);
        } finally {
          setWaitingForIndexing(false);
        }
      };

      // Small delay to ensure index is fully ready
      setTimeout(sendDelayedMessage, 1000);
    }
  }, [data?.status, waitingForIndexing]);

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
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
                disabled={sending || waitingForIndexing}
                {...txtarea}
                maxH={"80px"}
              />
            </MediaPDF>

            <IconButton
              aria-label={isStreaming ? "Stop streaming" : "Send message"}
              onClick={isStreaming ? abortStream : handleSendMessage}
              disabled={
                isStreaming
                  ? false
                  : !input.trim() || sending || waitingForIndexing
              }
              size="md"
              bg={
                isStreaming || (input.trim() && !sending && !waitingForIndexing)
                  ? "linear-gradient(135deg, #8B5CF6, #A855F7)"
                  : "rgba(100, 100, 120, 0.3)"
              }
              color="white"
              borderRadius="xl"
              transition="all 0.3s ease"
              boxShadow={
                isStreaming || (input.trim() && !sending && !waitingForIndexing)
                  ? "0 0 20px rgba(139, 92, 246, 0.4)"
                  : "none"
              }
              _hover={{
                transform:
                  isStreaming || (input.trim() && !sending && !waitingForIndexing)
                    ? "scale(1.1)"
                    : "none",
                boxShadow:
                  isStreaming || (input.trim() && !sending && !waitingForIndexing)
                    ? "0 0 30px rgba(139, 92, 246, 0.6)"
                    : "none",
              }}
              _active={{
                transform:
                  isStreaming || (input.trim() && !sending && !waitingForIndexing)
                    ? "scale(0.95)"
                    : "none",
              }}
              _disabled={{
                cursor: "not-allowed",
                opacity: 0.4,
              }}
            >
              {isStreaming ? <PauseIcon size={18} /> : <Send size={18} />}
            </IconButton>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default SendRequest;