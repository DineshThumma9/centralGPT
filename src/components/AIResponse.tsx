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
import { useColorMode } from "../contexts/ColorModeContext";

interface Props {
    msg: Message;
    idx: number;
}

// Style object generators
const getStreamCursor = (colors: any) => ({
    display: "inline-block",
    width: "2px",
    height: "1.2em",
    backgroundColor: colors.text.primary,
    marginLeft: "2px",
    animation: "blink 1s infinite",
});

const getMessageBox = (colors: any) => ({
    p: 5,
    borderRadius: "lg",
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    position: "relative" as const,
    boxShadow: "sm",
    transition: "all 0.2s",
    _hover: {
        boxShadow: "md",
        borderColor: colors.border.accent,
    },
    // Improve text rendering
    css: {
        lineHeight: "1.6",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        fontSize: "16px",
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale"
    }
});

const getAvatarBox = (colors: any) => ({
    mr: 3,
    mt: 1,
    flexShrink: 0,
});

const getActionButton = (colors: any) => ({
    color: colors.text.secondary,
    _hover: { 
        color: colors.text.primary,
        backgroundColor: colors.background.accent 
    },
});

const getSourcesContainer = (colors: any) => ({
    mt: 4,
    p: 3,
    borderRadius: "md",
    backgroundColor: colors.background.accent,
    border: `1px solid ${colors.border.secondary}`,
});

const getSourceItem = (colors: any) => ({
    p: 3,
    mb: 2,
    borderRadius: "sm",
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.secondary}`,
    transition: "all 0.2s",
    _hover: {
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
    },
});

const StreamingCursor = () => {
    const { colors } = useColorMode();
    const streamCursor = getStreamCursor(colors);
    
    return (
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
};

const SourcesDisplay = ({sources}: { sources: SourceDocument[] }) => {
    const { colors } = useColorMode();
    const [isExpanded, setIsExpanded] = useState(false);
    const [copiedSource, setCopiedSource] = useState<string | null>(null);
    
    const sourcesContainer = getSourcesContainer(colors);
    const sourceItem = getSourceItem(colors);

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
                color="green.200"
                _hover={{bg: "rgba(34, 197, 94, 0.2)"}}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Collapse sources" : "Expand sources"}
            >
                {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </IconButton>


            <Collapsible.Root open={isExpanded}>
                <Collapsible.Content gap={2}>
                    {sources.map((source, index) => (
                        <Box key={source.doc_id} {...sourceItem}>
                            <Flex justify="space-between" align="flex-start" mb={2}>
                                <VStack align="flex-start" gap={1} flex="1">
                                    <HStack>
                                        <Badge
                                            colorScheme="green"
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
    const { colors } = useColorMode();
    const [displayed, setDisplayed] = useState(msg.content || "");
    const [copied, setCopied] = useState(false);
    const [retry, setRetry] = useState(false);
    const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({});

    // Get dynamic style objects using colors from ColorModeContext
    const messageBox = getMessageBox(colors);
    const avatarBox = getAvatarBox(colors);
    const actionButton = getActionButton(colors);

    const isLastMessage = useMemo(() => idx === messages.length - 1, [idx, messages.length]);
    const isCurrentlyStreaming = useMemo(() =>
            msg.isStreaming || (isStreaming && isLastMessage),
        [msg.isStreaming, isStreaming, isLastMessage]
    );


    const cleanContent = useMemo(() => {
        if (!displayed) return "";


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
        handleCodeBlockCopy,
        colors
    );

    return (
        <Flex
            align="flex-start"
            w="100%"
            maxW="100%"
            direction="row"
            gap={3}
        >

            <Box flexShrink={0} mt={1}>
                <Box {...avatarBox}>
                    <Bot size={16} color="white"/>
                </Box>
            </Box>



            <Box
                flex="1"
                minW={0}
                maxW="calc(100% - 60px)"
            >
                {!retry ? (
                    <Box>
                        <Box {...messageBox}>

                            <Box
                                className="markdown-content"
                                css={{
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere",
                                    "& > *:first-child": {
                                        marginTop: 0
                                    },
                                    "& > *:last-child": {
                                        marginBottom: 0
                                    }
                                }}
                            >
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
                                        size="sm"
                                        variant="ghost"
                                        colorScheme={copied ? "purple" : "gray"}
                                        onClick={handleCopy}
                                        color={copied ? "purple.300" : "purple.200"}
                                        aria-label="Copy message"
                                    >
                                        {copied ? <Check size={16}/> : <Copy size={16}/>}
                                    </IconButton>

                                    <IconButton
                                        {...actionButton}
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleRetry}
                                        aria-label="Retry message"
                                    >
                                        <RepeatIcon size={16}/>
                                    </IconButton>
                                </HStack>
                            )}
                        </Box>


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