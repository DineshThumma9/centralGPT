import {Box, Flex, HStack, IconButton, Spinner, Text} from "@chakra-ui/react";
import {Bot, Check, Copy, RepeatIcon, Trash} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import type {Message} from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import {useEffect, useState, useMemo} from "react";
import {toaster} from "./ui/toaster.tsx";

interface Props {
    msg: Message;
    idx: number;
}

const AIResponse = ({msg, idx}: Props) => {
    const {sending, messages, shouldStream, isStreaming} = useSessionStore();
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
            setCopiedCodeBlocks(prev => ({ ...prev, [blockId]: true }));
            toaster.create({
                title: "Code copied to clipboard",
                type: "success",
                duration: 2000,
            });
            setTimeout(() => {
                setCopiedCodeBlocks(prev => {
                    const newState = { ...prev };
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

    // Only update displayed content when msg.content actually changes
    useEffect(() => {
        if (msg.content !== displayed) {
            setDisplayed(msg.content || "");
        }
    }, [msg.content]); // Remove other dependencies that cause loops

    const StreamingCursor = () => (
        <Box
            as="span"
            display="inline-block"
            w="2px"
            h="1em"
            bg="green.400"
            animation="blink 1s infinite"
            ml={1}
            css={{
                '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 }
                }
            }}
        />
    );

    return (
        <Flex align="flex-start" maxW="85%" minW="200px">
            <Box mr={3} mt={1} flexShrink={0}>
                <Box p={2} bg="green.500" borderRadius="full">
                    <Bot size={16} color="white"/>
                </Box>
            </Box>

            {!retry ? (
                <Box
                    fontSize="15px"
                    color="white"
                    width="100%"
                    lineHeight="1.65"
                    fontFamily="system-ui, -apple-system, sans-serif"

                >
                    {/* Show streaming content with monospace font during streaming */}
                    {(isCurrentlyStreaming && !isCurrentlyStreaming) ? (
                        <Box
                            as="div"
                            whiteSpace="pre-wrap"
                            fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
                            fontSize="14px"
                        >
                            {displayed}
                            <StreamingCursor />
                        </Box>
                    ) : (
                        /* Show final markdown-rendered content when streaming is complete */
                        <Box >
                            {displayed ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                        // Custom components for better styling
                                        code: ({node, inline, className, children, ...props}) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            // Extract plain text from React nodes properly
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
                                                    borderColor="gray.700"
                                                    _hover={{
                                                        borderColor: "gray.600",
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
                                                        bg="gray.800"
                                                        borderBottom="1px solid"
                                                        borderColor="gray.700"
                                                    >
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.400"
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
                                                            color={copiedCodeBlocks[blockId] ? "green.400" : "gray.400"}
                                                            onClick={() => handleCodeBlockCopy(codeString, blockId)}
                                                            _hover={{
                                                                bg: "gray.700",
                                                                opacity: 1,
                                                                transform: "scale(1.05)"
                                                            }}
                                                            _active={{ transform: "scale(0.95)" }}
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
                                                    bg="gray.700"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                    fontSize="13px"
                                                    fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
                                                    color="gray.200"
                                                    {...props}
                                                >
                                                    {children}
                                                </Box>
                                            );
                                        },
                                        p: ({children}) => (
                                            <Text mb={3} lineHeight="1.7">
                                                {children}
                                            </Text>
                                        ),
                                        h1: ({children}) => (
                                            <Text as="h1" fontSize="xl" fontWeight="bold" mb={3} mt={4}>
                                                {children}
                                            </Text>
                                        ),
                                        h2: ({children}) => (
                                            <Text as="h2" fontSize="lg" fontWeight="bold" mb={2} mt={3}>
                                                {children}
                                            </Text>
                                        ),
                                        h3: ({children}) => (
                                            <Text as="h3" fontSize="md" fontWeight="bold" mb={2} mt={2}>
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
                        <HStack mt={3}>
                            <IconButton
                                aria-label="Copy code"
                                size="sm"
                                variant="ghost"
                                colorScheme={copied ? "green" : "gray"}
                                onClick={handleCopy}
                                _hover={{bg: "gray.700"}}
                            >
                                {copied ? <Check color={"white"} size={16}/> : <Copy color={"white"} size={16}/>}
                            </IconButton>

                            <IconButton
                                aria-label="Retry"
                                size="sm"
                                variant="ghost"
                                onClick={handleRetry}
                            >
                                <RepeatIcon color={"white"} size={16}/>
                            </IconButton>


                        </HStack>
                    )}
                </Box>
            ) : (
                <Spinner/>
            )}
        </Flex>
    );
};

export default AIResponse;