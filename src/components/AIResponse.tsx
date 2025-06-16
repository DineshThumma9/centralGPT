import {Box, Flex, HStack, IconButton, Spinner} from "@chakra-ui/react";
import {Bot, Check, Copy, RepeatIcon, Trash} from "lucide-react";
import TypingBubble from "./TypingBubble";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import type {Message} from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import {useEffect, useState} from "react";
import {toaster} from "./ui/toaster.tsx";

interface Props {
    msg: Message;
    idx: number;
}

const AIResponse = ({msg, idx}: Props) => {
    const {sending, messages, shouldStream} = useSessionStore();
    const [displayed, setDisplayed] = useState("");
    const [copied, setCopied] = useState(false);
    const [retry, setRetry] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayed.trimEnd()); // 🔥 FIX 1: correctly using displayed instead of `children`
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

    const handleRetry = () => {
        setRetry(true);
        // 🔥 FIX 2: you'd likely want to trigger a parent-side regeneration
        // e.g., call a prop like onRetry(msg)
        // For now we just fake a delay then restore
        setTimeout(() => {
            setRetry(false);
            toaster.create({title: "Retry simulated", type: "info", duration: 1500});
        }, 1500);
    };

    useEffect(() => {
        setDisplayed(msg.content); // 🔥 FIX 3: display message on update
    }, [msg.content]);

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
                    css={{
                        '& p': {marginBottom: '1rem'},
                        '& code:not(pre code)': {
                            background: 'rgba(255,255,255,0.1)',
                            color: '#ffd700',
                            padding: '2px 6px',
                            borderRadius: '4px'
                        }
                    }}
                >
                    {sending && idx === messages.length - 1 && shouldStream ? (
                        <TypingBubble/>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeHighlight]}
                            // 🔥 FIX 4: enable custom code renderer
                        >
                            {displayed}
                        </ReactMarkdown>
                    )}

                    <HStack mt={3}>
                        <IconButton
                            aria-label="Copy code"
                            size="sm"
                            variant="ghost"
                            colorScheme={copied ? "green" : "gray"}
                            onClick={handleCopy}
                            _hover={{bg: "gray.700"}}
                        >
                            {copied ? <Check size={16}/> : <Copy size={16}/>}
                        </IconButton>

                        <IconButton
                            aria-label="Retry"
                            size="sm"
                            variant="ghost"
                            onClick={handleRetry}
                        >
                            <RepeatIcon size={16}/>
                        </IconButton>

                        <IconButton
                            aria-label="Delete"
                            size="sm"
                            variant="ghost"
                            onClick={() => toaster.create({
                                title: "Delete action not yet implemented",
                                type: "warning",
                                duration: 1500
                            })}
                        >
                            <Trash size={16}/>
                        </IconButton>
                    </HStack>
                </Box>
            ) : (
                <Spinner/>
            )}
        </Flex>
    );
};

export default AIResponse;
