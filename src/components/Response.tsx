import {Box, Center, Flex, Heading, IconButton, Text, VStack,} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import sessionStore from "../store/sessionStore.ts";
import ReactMarkdown from "react-markdown";

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import "highlight.js/styles/github-dark.css";
import type {Message} from "../entities/Message.ts";
import {Bot, Check, Copy} from "lucide-react";
import {toaster} from "./ui/toaster.tsx";

const backgroundColor = "app.bg";

const CodeBlock = ({children, className, ...props}: any) => {
    const [copied, setCopied] = useState(false);


    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
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

    if (match) {
        return (
            <Box position="relative" my={4}>
                <Flex
                    justify="space-between"
                    align="center"
                    bg="gray.800"
                    px={4}
                    py={2}
                    borderTopRadius="md"
                >
                    <Text fontSize="sm" color="gray.300" fontFamily="mono">
                        {language}
                    </Text>
                    <IconButton
                        aria-label="Copy code"
                        icon={copied ? <Check size={16}/> : <Copy size={16}/>}
                        size="sm"
                        variant="ghost"
                        colorScheme={copied ? "green" : "gray"}
                        onClick={handleCopy}
                        _hover={{bg: "gray.700"}}
                    />
                </Flex>
                <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: '6px',
                        borderBottomRightRadius: '6px',
                    }}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </Box>
        );
    }

    return (
        <Box
            as="code"
            bg="gray.700"
            px={2}
            py={1}
            borderRadius="sm"
            fontSize="0.9em"
            fontFamily="mono"
            color="white"
        >
            {children}
        </Box>
    );
};

const Response = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe((state) => {
            setMessages(state.messages);
        });

        setMessages(sessionStore.getState().messages);
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // Group messages into conversation pairs
    const groupedMessages = [];
    for (let i = 0; i < messages.length; i += 2) {
        const userMsg = messages[i];
        const aiMsg = messages[i + 1];
        groupedMessages.push({userMsg, aiMsg});
    }

    return (
        <Box
            ref={containerRef}
            h="100%"
            w="full"
            overflowY="auto"
            bg={backgroundColor}
            css={{
                '&::-webkit-scrollbar': {width: '6px'},
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                },
            }}
        >
            {messages.length === 0 ? (
                <Center h="full">
                    <VStack gap={6} textAlign="center">
                        <Box p={4} bg="gray.50" borderRadius="full">
                            <Bot size={32} color="#666"/>
                        </Box>
                        <VStack gap={2}>
                            <Heading fontSize="xl" fontWeight="600" color="gray.700">
                                Start a conversation
                            </Heading>
                            <Text fontSize="md" color="gray.500" maxW="400px" lineHeight="1.6">
                                Choose a model and start chatting. Your messages will appear here.
                            </Text>
                        </VStack>
                    </VStack>
                </Center>
            ) : (
                <VStack gap={8} align="stretch" w="full" maxW="4xl" mx="auto" py={6}>
                    {groupedMessages.map((pair, pairIdx) => (
                        <VStack key={pairIdx} gap={3} align="stretch">
                            {/* User Message */}
                            {pair.userMsg && (
                                <Flex justify="flex-end" px={6}>
                                    <Box
                                        bg="gray.700"
                                        px={4}
                                        py={3}
                                        borderRadius="lg"
                                        fontSize="md"
                                        color="white"
                                        lineHeight="1.6"
                                        whiteSpace="pre-wrap"
                                        wordBreak="break-word"
                                        maxW="80%"
                                    >
                                        {pair.userMsg.content}
                                    </Box>
                                </Flex>
                            )}

                            {/* AI Message */}
                            {pair.aiMsg && (
                                <Flex justify="flex-start" px={6}>
                                    <Flex align="flex-start" maxW="80%">
                                        <Box mr={3} mt={1}>
                                            <Box p={2} bg="green.500" borderRadius="full">
                                                <Bot size={16} color="white"/>
                                            </Box>
                                        </Box>
                                        <Box
                                            fontSize="md"
                                            color="white"
                                            whiteSpace="pre-wrap"
                                            wordBreak="break-word"
                                            css={{
                                                '& p': {mb: 3},
                                                '& p:last-child': {mb: 0},
                                                '& ul, & ol': {pl: 4, mb: 3},
                                                '& li': {mb: 1},
                                                '& h1, & h2, & h3': {
                                                    fontWeight: 'bold',
                                                    mb: 2,
                                                    mt: 4,
                                                    '&:first-child': {mt: 0}
                                                },
                                                '& blockquote': {
                                                    borderLeft: '4px solid',
                                                    borderColor: 'gray.300',
                                                    pl: 4,
                                                    fontStyle: 'italic',
                                                    mb: 3,
                                                },
                                            }}
                                        >
                                            <ReactMarkdown
                                                components={{
                                                    code: CodeBlock,
                                                }}
                                            >
                                                {pair.aiMsg.content}
                                            </ReactMarkdown>
                                        </Box>
                                    </Flex>
                                </Flex>
                            )}
                        </VStack>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default Response;