// AIResponse.tsx
import {Box, Flex} from "@chakra-ui/react";
import {Bot} from "lucide-react";
import TypingBubble from "./TypingBubble";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";
import type {Message} from "../entities/Message";
import useSessionStore from "../store/sessionStore";
import {useEffect, useState} from "react";

interface Props {
    msg: Message;
    idx: number;
}

const AIResponse = ({msg, idx}: Props) => {
    const {sending, messages} = useSessionStore();
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        if (!sending) {
            setDisplayed(msg.content);
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed((prev) => prev + msg.content[i]);
            i++;
            if (i >= msg.content.length) clearInterval(interval);
        }, 15);
        return () => clearInterval(interval);
    }, [msg.content, sending]);

    return (
        <Flex align="flex-start" maxW="85%" minW="200px">
            <Box mr={3} mt={1} flexShrink={0}>
                <Box p={2} bg="green.500" borderRadius="full">
                    <Bot size={16} color="white"/>
                </Box>
            </Box>

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


                {sending && idx === messages.length - 1 ? (
                    <TypingBubble/>
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        rehypePlugins={[rehypeHighlight]}
                       
                    >
                        {msg.content}
                    </ReactMarkdown>
                )}


            </Box>
        </Flex>
    );
};

export default AIResponse;

// CodeBlock.tsx remains the same as you already had it. Consider styling tweak if needed.
