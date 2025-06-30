// src/components/AIResponse.tsx
import {Box, Flex, HStack, IconButton, Spinner, Text} from "@chakra-ui/react";
import { Bot, Check, Copy, RepeatIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import type { Message } from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import { useEffect, useMemo, useState } from "react";
import { toaster } from "./ui/toaster.tsx";
import { createMarkdownComponents } from "./MarkdownComponents";

interface Props {
    msg: Message;
    idx: number;
}

export const streamCursor = {
    display: "inline-block",
    w: "2px",
    h: "1em",
    bg: "purple.300",
    animation: "blink 1s infinite",
    ml: 1
}

export const messageBox = {
    fontSize: "15px",
    color: "white",
    width: "100%",
    lineHeight: "1.65",
    fontFamily: "system-ui, -apple-system, sans-serif",
    bg: "rgba(30, 30, 50, 0.8)",
    backdropFilter: "blur(10px)",
    p: 4,
    borderRadius: "xl",
    border: "2px solid",
    borderColor: "rgba(139, 92, 246, 0.3)",
    boxShadow: "0 4px 20px rgba(147, 51, 234, 0.2)",
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    _hover: {
        borderColor: "rgba(139, 92, 246, 0.5)",
        boxShadow: "0 6px 25px rgba(147, 51, 234, 0.3)"
    },
    transition: "all 0.3s ease"
}

export const avatarBox = {
    p: 2,
    bg: "linear-gradient(135deg, purple.500, violet.500)",
    borderRadius: "full",
    boxShadow: "0 4px 12px rgba(147, 51, 234, 0.4)",
    border: "2px solid",
    borderColor: "purple.300"
}

export const codeBlockContainer = {
    position: "relative" as const,
    bg: "rgba(15, 15, 25, 0.9)",
    borderRadius: "lg",
    overflow: "hidden" as const,
    my: 3,
    border: "2px solid",
    borderColor: "rgba(139, 92, 246, 0.4)",
    maxW: "100%",
    _hover: {
        borderColor: "rgba(139, 92, 246, 0.6)",
        '& .copy-button': {
            opacity: 1
        }
    },
    transition: "border-color 0.2s",
    boxShadow: "0 2px 15px rgba(147, 51, 234, 0.2)"
}

export const codeBlockHeader = {
    justify: "space-between" as const,
    align: "center" as const,
    px: 4,
    py: 2,
    bg: "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8))",
    borderBottom: "1px solid",
    borderColor: "rgba(139, 92, 246, 0.4)"
}

export const codeBlockContent = {
    p: 4,
    overflow: "auto" as const,
    m: 0,
    bg: "rgba(15, 15, 25, 0.9)",
    maxH: "400px"
}

export const inlineCode = {
    bg: "rgba(139, 92, 246, 0.2)",
    px: 2,
    py: 1,
    borderRadius: "md",
    fontSize: "13px",
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace",
    color: "purple.200",
    border: "1px solid",
    borderColor: "rgba(139, 92, 246, 0.3)"
}

export const streamingContent = {
    whiteSpace: "pre-wrap" as const,
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace",
    fontSize: "14px",
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
    color: "purple.100"
}

const actionButton = {
    size: "sm" as const,
    variant: "ghost" as const,
    color: "purple.200",
    _hover: {
        bg: "rgba(139, 92, 246, 0.2)",
        color: "purple.100"
    }
}

const StreamingCursor = () => (
    <Box
        {...streamCursor}
        css={{
            '@keyframes blink': {
                '0%, 50%': { opacity: 1 },
                '51%, 100%': { opacity: 0 }
            }
        }}
    />
);

const AIResponse = ({ msg, idx }: Props) => {
    const { messages, isStreaming } = useSessionStore();
    const [displayed, setDisplayed] = useState(msg.content || "");
    const [copied, setCopied] = useState(false);
    const [retry, setRetry] = useState(false);
    const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({});

    const isLastMessage = useMemo(() => idx === messages.length - 1, [idx, messages.length]);
    const isCurrentlyStreaming = useMemo(() =>
        msg.isStreaming || (isStreaming && isLastMessage),
        [msg.isStreaming, isStreaming, isLastMessage]
    );

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayed.trimEnd());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Error has occured" , err)
        }
    };

    const handleCodeBlockCopy = async (code: string, blockId: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCodeBlocks(prev => ({ ...prev, [blockId]: true }));
            setTimeout(() => {
                setCopiedCodeBlocks(prev => {
                    const newState = { ...prev };
                    delete newState[blockId];
                    return newState;
                });
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleRetry = () => {
        setRetry(true);
        setTimeout(() => {
            setRetry(false);
            toaster.create({ title: "Retry simulated", type: "info", duration: 1500 });
        }, 1500);
    };

    useEffect(() => {
        if (msg.content !== displayed) {
            setDisplayed(msg.content || "");
        }
    }, [msg.content]);

    const markdownComponents = createMarkdownComponents(
        idx,
        copiedCodeBlocks,
        handleCodeBlockCopy
    );

    return (
        <Flex
            align="flex-start"
            w="100%"
            maxW="100%"
            direction="row"
            gap={3}
        >
            {/* Avatar - Fixed width */}
            <Box flexShrink={0} mt={1}>
                <Box {...avatarBox}>
                    <Bot size={16} color="white" />
                </Box>
            </Box>

            {/* Content container - Flexible width with proper constraints */}
            <Box
                flex="1"
                minW={0} // Critical for text wrapping
                maxW="calc(100% - 60px)" // Account for avatar and gaps
            >
                {!retry ? (
                    <Box {...messageBox}>
                        {/* Show streaming content with monospace font during streaming */}
                        {isCurrentlyStreaming ? (
                            <Box {...streamingContent}>
                                {displayed}
                                <StreamingCursor />
                            </Box>
                        ) : (
                            <Box>
                                {displayed ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={markdownComponents}
                                    >
                                        {displayed}
                                    </ReactMarkdown>
                                ) : (
                                    <Text color="purple.300" fontStyle="italic">
                                        Waiting for response...
                                    </Text>
                                )}
                            </Box>
                        )}

                        {!isCurrentlyStreaming && (
                                <HStack mt={3} gap={2}>
                                    <IconButton
                                        {...actionButton}
                                        colorScheme={copied ? "purple" : "gray"}
                                        onClick={handleCopy}
                                        color={copied ? "purple.300" : "purple.200"}
                                        aria-label="Copy message"
                                    >
                                        {copied ? <Check size={16}/> : <Copy size={16}/>}
                                    </IconButton>

                                    <IconButton
                                        {...actionButton}
                                        onClick={handleRetry}
                                        aria-label="Retry message"
                                    >
                                        <RepeatIcon size={16}/>
                                    </IconButton>
                                </HStack>
                            )}
                    </Box>
                ) : (
                    <Flex justify="center" p={4}>
                        <Spinner color="purple.400" size="lg" />
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default AIResponse;