// src/components/AIResponse.tsx
import {Box, Flex, HStack, IconButton, Skeleton, SkeletonText, Spinner, VStack} from "@chakra-ui/react";
import {Check, Copy, RepeatIcon} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import type {Message} from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import {useEffect, useMemo, useState} from "react";
import {toaster} from "./ui/toaster.tsx";
import {createMarkdownComponents} from "./MarkdownComponents";

import SourcesDisplay from "./SourceDisplay.tsx";

interface Props {
    msg: Message;
    idx: number;
}


const getMessageBox = () => ({
    p: 5,
    borderRadius: "lg",
    backgroundColor: "bg.panel",
    border: `1px solid {"border.subtle"}`,
    position: "relative" as const,
    boxShadow: "sm",
    transition: "all 0.2s",
    _hover: {
        boxShadow: "md",
        borderColor: "colorPalette.500",
    },

    css: {
        lineHeight: "1.6",
        fontSize:16,

        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale"
    }
});


const getActionButton = () => ({
    color: { base: "brand.700", _dark: "brand.600" },
    borderRadius: "8px",
    transition: "all 0.2s ease",
    _hover: {
        color: { base: "brand.800", _dark: "brand.500" },
        backgroundColor: { base: "brand.50", _dark: "brand.950" },
        transform: "scale(1.05)",
    },
    _active: {
        backgroundColor: { base: "brand.100", _dark: "brand.900" },
        transform: "scale(0.95)",
    }
});


const AIResponse = ({msg, idx}: Props) => {
    const {messages, isStreaming} = useSessionStore();
    
    const [displayed, setDisplayed] = useState(msg.content || "");
    const [copied, setCopied] = useState(false);
    const [retry, setRetry] = useState(false);
    const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({});

    // Get dynamic style objects
    const messageBox = getMessageBox();

    const actionButton = getActionButton();

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
        // Only update displayed content if there's a significant change
        // This prevents rapid re-renders during streaming
        if (msg.content && msg.content !== displayed) {
            const timeoutId = setTimeout(() => {
                setDisplayed(msg.content || "");
            }, 16); // Throttle updates to ~60fps
            
            return () => clearTimeout(timeoutId);
        }
    }, [msg.content, displayed]);

    const markdownComponents = createMarkdownComponents(
        idx,
        copiedCodeBlocks,
        handleCodeBlockCopy
    );

    return (
        <Flex
            justify="center"
            align="flex-start"
            w="100%"
            maxW="100%"
            direction="row"
            gap={2}
            bg={"bg.canvas"}
        >


            <Box
                flex="1"
                minW={0}
                maxW="800px"
                mx="auto"
            >
                {!retry ? (
                    <Box>
                        <Box {...messageBox}>
                            <Box
                                className="markdown-content"
                                minH={isCurrentlyStreaming ? "60px" : "auto"}
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
                                    <>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            rehypePlugins={[rehypeHighlight]}
                                            components={markdownComponents}
                                        >
                                            {cleanContent}
                                        </ReactMarkdown>
                                        {isCurrentlyStreaming && (
                                            <Box
                                                as="span"
                                                display="inline-block"
                                                w="2px"
                                                h="1.2em"
                                                bg={{ base: "brand.600", _dark: "brand.500" }}
                                                ml="1px"
                                                animation="blink 1s infinite"
                                                css={{
                                                    "@keyframes blink": {
                                                        "0%, 50%": { opacity: 1 },
                                                        "51%, 100%": { opacity: 0 }
                                                    }
                                                }}
                                            />
                                        )}
                                    </>
                                ) : isCurrentlyStreaming ? (
                                    <VStack align="stretch" gap={4} py={2}>
                                        <HStack gap={3} w="full">
                                            <Skeleton height="4" width="25%" />
                                            <Skeleton height="4" width="45%" />
                                            <Skeleton height="4" width="20%" />
                                        </HStack>
                                        <SkeletonText noOfLines={4} gap="3" />
                                        <HStack gap={2} w="full">
                                            <Skeleton height="4" width="35%" />
                                            <Skeleton height="4" width="30%" />
                                        </HStack>
                                    </VStack>
                                ) : (
                                    <VStack align="stretch" gap={3}>
                                        <SkeletonText noOfLines={3} gap="4"/>
                                        <Skeleton height="20px" borderRadius="md"/>
                                        <Skeleton height="16px" width="80%" borderRadius="md"/>
                                    </VStack>
                                )}
                            </Box>

                            {!isCurrentlyStreaming && (
                                <HStack mt={3} gap={2}>
                                    <IconButton
                                        {...actionButton}
                                        size="sm"
                                        variant="ghost"
                                        bg={copied ? { base: "brand.100", _dark: "brand.900" } : "transparent"}
                                        onClick={handleCopy}
                                        color={copied ? { base: "brand.800", _dark: "brand.400" } : { base: "brand.700", _dark: "brand.600" }}
                                        aria-label="Copy message"
                                    >
                                        {copied ? <Check size={16}/> : <Copy size={16}/>}
                                    </IconButton>

                                    <IconButton
                                        {...actionButton}
                                        size="sm"
                                        variant="ghost"
                                        bg="transparent"
                                        color={{ base: "brand.700", _dark: "brand.600" }}
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
                        <Spinner color="app.button.primary" size="lg"/>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default AIResponse;