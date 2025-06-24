import {Box, Flex, HStack, IconButton, Spinner, Text} from "@chakra-ui/react";
import {Bot, Check, Copy, RepeatIcon} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import type {Message} from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import {useEffect, useMemo, useState} from "react";
import {toaster} from "./ui/toaster.tsx";

interface Props {
    msg: Message;
    idx: number;
}

const AIResponse = ({msg, idx}: Props) => {
    const { messages, isStreaming} = useSessionStore();
    const [displayed, setDisplayed] = useState(msg.content || "");
    const [copied, setCopied] = useState(false);
    const [retry, setRetry] = useState(false);
    const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({});

    // Use useMemo to prevent unnecessary recalculations
    const isLastMessage = useMemo(() => idx === messages.length - 1, [idx, messages.length]);
    const isCurrentlyStreaming = useMemo(() =>
            msg.isStreaming || (isStreaming && isLastMessage),
        [msg.isStreaming, isStreaming, isLastMessage]
    );

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayed.trimEnd());
            setCopied(true);
            toaster.create({
                title: "Copied to clipboard",
                type: "success",
                duration: 2000,
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toaster.create({
                title: "Failed to copy",
                type: "error",
                duration: 2000,
            });
        }
    };

    const handleCodeBlockCopy = async (code: string, blockId: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCodeBlocks(prev => ({...prev, [blockId]: true}));
            toaster.create({
                title: "Code copied to clipboard",
                type: "success",
                duration: 2000,
            });
            setTimeout(() => {
                setCopiedCodeBlocks(prev => {
                    const newState = {...prev};
                    delete newState[blockId];
                    return newState;
                });
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            toaster.create({
                title: "Failed to copy code",
                type: "error",
                duration: 2000,
            });
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

    const StreamingCursor = () => (
        <Box
            as="span"
            display="inline-block"
            w="2px"
            h="1em"
            bg="purple.400"
            animation="blink 1s infinite"
            ml={1}
            css={{
                '@keyframes blink': {
                    '0%, 50%': {opacity: 1},
                    '51%, 100%': {opacity: 0}
                }
            }}
        />
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
                <Box
                    p={2}
                    bg="linear-gradient(135deg, purple.500, violet.500)"
                    borderRadius="full"
                    boxShadow="0 2px 8px rgba(147, 51, 234, 0.3)"
                >
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
                    <Box
                        fontSize="15px"
                        color="gray.800"
                        width="100%"
                        lineHeight="1.65"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        bg="white"
                        p={4}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="purple.100"
                        boxShadow="0 2px 12px rgba(147, 51, 234, 0.08)"
                        wordBreak="break-word"
                        overflowWrap="break-word"
                    >
                        {/* Show streaming content with monospace font during streaming */}
                        {(isCurrentlyStreaming && !isCurrentlyStreaming)? (
                            <Box
                                as="div"
                                whiteSpace="pre-wrap"
                                fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
                                fontSize="14px"
                                wordBreak="break-word"
                                overflowWrap="break-word"
                            >
                                {displayed}
                                <StreamingCursor/>
                            </Box>
                        ) : (
                            /* Show final markdown-rendered content when streaming is complete */
                            <Box>
                                {displayed ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        rehypePlugins={[rehypeHighlight]}
                                        components={{
                                            // Custom components for better styling
                                            code: ({node, inline, className, children, ...props}) => {
                                                const match = /language-(\w+)/.exec(className || '');

                                                const getTextContent = (node: any): string => {
                                                    if (typeof node === 'string') return node;
                                                    if (Array.isArray(node)) return node.map(getTextContent).join('');
                                                    if (node?.props?.children) return getTextContent(node.props.children);
                                                    return '';
                                                };
                                                const codeString = getTextContent(children).replace(/\n$/, '');
                                                const blockId = `${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

                                                return !inline ? (
                                                    <Box
                                                        position="relative"
                                                        bg="gray.900"
                                                        borderRadius="lg"
                                                        overflow="hidden"
                                                        my={3}
                                                        border="1px solid"
                                                        borderColor="purple.200"
                                                        maxW="100%"
                                                        _hover={{
                                                            borderColor: "purple.300",
                                                            '& .copy-button': {
                                                                opacity: 1
                                                            }
                                                        }}
                                                        transition="border-color 0.2s"
                                                    >
                                                        {/* Language label and copy button header */}
                                                        <Flex
                                                            justify="space-between"
                                                            align="center"
                                                            px={4}
                                                            py={2}
                                                            bg="purple.800"
                                                            borderBottom="1px solid"
                                                            borderColor="purple.200"
                                                        >
                                                            <Text
                                                                fontSize="xs"
                                                                color="purple.200"
                                                                fontWeight="semibold"
                                                                textTransform="uppercase"
                                                                letterSpacing="wider"
                                                            >
                                                                {match ? match[1] : 'plaintext'}
                                                            </Text>
                                                            <IconButton
                                                                className="copy-button"
                                                                aria-label="Copy code block"
                                                                size="sm"
                                                                variant="ghost"
                                                                opacity={0.7}
                                                                transition="all 0.2s"
                                                                color={copiedCodeBlocks[blockId] ? "purple.400" : "purple.200"}
                                                                onClick={() => handleCodeBlockCopy(codeString, blockId)}
                                                                _hover={{
                                                                    bg: "purple.700",
                                                                    opacity: 1,
                                                                    transform: "scale(1.05)"
                                                                }}
                                                                _active={{transform: "scale(0.95)"}}
                                                            >
                                                                {copiedCodeBlocks[blockId] ?
                                                                    <Check size={14}/> :
                                                                    <Copy size={14}/>
                                                                }
                                                            </IconButton>
                                                        </Flex>

                                                        {/* Code content */}
                                                        <Box
                                                            as="pre"
                                                            p={4}
                                                            overflow="auto"
                                                            m={0}
                                                            bg="gray.900"
                                                            maxH="400px"
                                                        >
                                                            <Box
                                                                as="code"
                                                                className={className}
                                                                fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
                                                                fontSize="13px"
                                                                lineHeight="1.5"
                                                                color="gray.100"
                                                                {...props}
                                                            >
                                                                {children}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        as="code"
                                                        bg="purple.100"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                        fontSize="13px"
                                                        fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
                                                        color="purple.800"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </Box>
                                                );
                                            },
                                            p: ({children}) => (
                                                <Text mb={3} lineHeight="1.7" wordBreak="break-word">
                                                    {children}
                                                </Text>
                                            ),
                                            h1: ({children}) => (
                                                <Text as="h1" fontSize="xl" fontWeight="bold" mb={3} mt={4}
                                                      color="purple.700">
                                                    {children}
                                                </Text>
                                            ),
                                            h2: ({children}) => (
                                                <Text as="h2" fontSize="lg" fontWeight="bold" mb={2} mt={3}
                                                      color="purple.600">
                                                    {children}
                                                </Text>
                                            ),
                                            h3: ({children}) => (
                                                <Text as="h3" fontSize="md" fontWeight="bold" mb={2} mt={2}
                                                      color="purple.600">
                                                    {children}
                                                </Text>
                                            ),
                                        }}
                                    >
                                        {displayed}
                                    </ReactMarkdown>
                                ) : (
                                    <Text color="gray.400" fontStyle="italic">
                                        Waiting for response...
                                    </Text>
                                )}
                            </Box>
                        )}

                        {/* Action buttons - only show when not streaming */}
                        {!isCurrentlyStreaming && (
                            <HStack mt={3} gap={2}>
                                <IconButton
                                    aria-label="Copy response"
                                    size="sm"
                                    variant="ghost"
                                    colorScheme={copied ? "purple" : "gray"}
                                    onClick={handleCopy}
                                    _hover={{bg: "purple.50"}}
                                >
                                    {copied ? <Check color="purple" size={16}/> : <Copy color="gray" size={16}/>}
                                </IconButton>

                                <IconButton
                                    aria-label="Retry"
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleRetry}
                                    _hover={{bg: "purple.50"}}
                                >
                                    <RepeatIcon color="gray" size={16}/>
                                </IconButton>
                            </HStack>
                        )}
                    </Box>
                ) : (
                    <Flex justify="center" p={4}>
                        <Spinner color="purple.500"/>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default AIResponse;