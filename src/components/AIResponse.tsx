// src/components/AIResponse.tsx
import {Badge, Box, Collapsible, Flex, HStack, IconButton, Spinner, Text, VStack} from "@chakra-ui/react";
import {Bot, Check, ChevronDown, ChevronUp, Copy, RepeatIcon} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import type {Message, SourceDocument} from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import {useEffect, useMemo, useState} from "react";
import {toaster} from "./ui/toaster.tsx";
import {createMarkdownComponents} from "./MarkdownComponents";

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
    p: 5,
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


const actionButton = {
    size: "sm" as const,
    variant: "ghost" as const,
    color: "purple.200",
    _hover: {
        bg: "rgba(139, 92, 246, 0.2)",
        color: "purple.100"
    }
}

const sourcesContainer = {
    mt: 4,
    p: 3,
    bg: "rgba(20, 20, 35, 0.9)",
    borderRadius: "lg",
    border: "1px solid",
    borderColor: "rgba(139, 92, 246, 0.3)",
    boxShadow: "0 2px 10px rgba(147, 51, 234, 0.1)"
}

const sourceItem = {
    p: 3,
    bg: "rgba(30, 30, 50, 0.6)",
    borderRadius: "md",
    border: "1px solid",
    borderColor: "rgba(139, 92, 246, 0.2)",
    _hover: {
        borderColor: "rgba(139, 92, 246, 0.4)",
        bg: "rgba(30, 30, 50, 0.8)"
    },
    transition: "all 0.2s ease"
}

const StreamingCursor = () => (
    <Box
        {...streamCursor}
        css={{
            '@keyframes blink': {
                '0%, 50%': {opacity: 1},
                '51%, 100%': {opacity: 0}
            }
        }}
    />
);

const SourcesDisplay = ({sources}: { sources: SourceDocument[] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copiedSource, setCopiedSource] = useState<string | null>(null);

    const handleCopySource = async (text: string, docId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedSource(docId);
            setTimeout(() => setCopiedSource(null), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    if (!sources || sources.length === 0) return null;

    return (
        <Box {...sourcesContainer}>

            <IconButton
                size="xs"
                variant="ghost"
                color="purple.200"
                _hover={{bg: "rgba(139, 92, 246, 0.2)"}}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse sources" : "Expand sources"}
            >
                {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </IconButton>
            {/*</Flex>*/}

            <Collapsible.Root open={isExpanded}>
                <Collapsible.Content gap={2}>
                    {sources.map((source, index) => (
                        <Box key={source.doc_id} {...sourceItem}>
                            <Flex justify="space-between" align="flex-start" mb={2}>
                                <VStack align="flex-start" gap={1} flex="1">
                                    <HStack>
                                        <Badge
                                            colorScheme="purple"
                                            variant="subtle"
                                            fontSize="xs"
                                        >
                                            #{index + 1}
                                        </Badge>
                                        <Text fontSize="sm" fontWeight="medium" color="white">
                                            {source.metadata.file_name || 'Unknown File'}
                                        </Text>
                                    </HStack>
                                    <HStack fontSize="xs" color="purple.200">
                                        <Text>Page: {source.metadata.page_label || 'N/A'}</Text>
                                        <Text>•</Text>
                                        <Text>Relevance: {(source.score * 100).toFixed(1)}%</Text>
                                    </HStack>
                                </VStack>
                                <IconButton
                                    size="xs"
                                    variant="ghost"
                                    color={copiedSource === source.doc_id ? "purple.300" : "purple.200"}
                                    _hover={{bg: "rgba(139, 92, 246, 0.2)"}}
                                    onClick={() => handleCopySource(source.text, source.doc_id)}
                                    aria-label="Copy source text"
                                >
                                    {copiedSource === source.doc_id ? <Check size={12}/> : <Copy size={12}/>}
                                </IconButton>
                            </Flex>
                            <Text fontSize="xs" color="purple.100" lineHeight="1.4">
                                {source.text.substring(0, 200)}
                                {source.text.length > 200 && '...'}
                            </Text>
                        </Box>
                    ))}
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
};

const AIResponse = ({msg, idx}: Props) => {
    const {messages, isStreaming} = useSessionStore();
    const [displayed, setDisplayed] = useState(msg.content || "");
    const [copied, setCopied] = useState(false);
    const [retry, setRetry] = useState(false);
    const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({});

    const isLastMessage = useMemo(() => idx === messages.length - 1, [idx, messages.length]);
    const isCurrentlyStreaming = useMemo(() =>
            msg.isStreaming || (isStreaming && isLastMessage),
        [msg.isStreaming, isStreaming, isLastMessage]
    );

    // Clean content by removing sources section if it exists
    const cleanContent = useMemo(() => {
        if (!displayed) return "";

        // Remove sources section that might have been added by the old implementation
        const sourcesRegex = /\n\n📚 \*\*Sources:\*\*\n[\s\S]*$/;
        return displayed.replace(sourcesRegex, "");
    }, [displayed]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(cleanContent.trimEnd());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Error has occurred", err);
        }
    };

    const handleCodeBlockCopy = async (code: string, blockId: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCodeBlocks(prev => ({...prev, [blockId]: true}));
            setTimeout(() => {
                setCopiedCodeBlocks(prev => {
                    const newState = {...prev};
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
            toaster.create({title: "Retry simulated", type: "info", duration: 1500});
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
                    <Bot size={16} color="white"/>
                </Box>
            </Box>

            {/* Content container - Flexible width with proper constraints */}
            <Box
                flex="1"
                minW={0} // Critical for text wrapping
                maxW="calc(100% - 60px)" // Account for avatar and gaps
            >
                {!retry ? (
                    <Box>
                        <Box {...messageBox}>
                            {/* Show streaming content with monospace font during streaming */}
                            <Box>
                                {cleanContent ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={markdownComponents}
                                    >
                                        {cleanContent}
                                    </ReactMarkdown>
                                ) : (
                                    StreamingCursor()
                                )}
                            </Box>

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

                        {/* Sources Display - Only show if not streaming and sources exist */}
                        {!isCurrentlyStreaming && msg.sources && (
                            <SourcesDisplay sources={msg.sources}/>
                        )}
                    </Box>
                ) : (
                    <Flex justify="center" p={4}>
                        <Spinner color="purple.400" size="lg"/>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default AIResponse;