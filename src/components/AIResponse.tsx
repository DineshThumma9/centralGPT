import { Box, Flex } from "@chakra-ui/react";
import { Bot } from "lucide-react";
import TypingBubble from "./TypingBubble.tsx";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock.tsx";
import type { Message } from "../entities/Message.ts";
import useSessionStore from "../store/sessionStore.ts";

interface Props {
  msg: Message;
  idx: number;
}

const AIResponse = ({ msg, idx }: Props) => {
  const { sending, messages } = useSessionStore();

  return (
    <Flex align="flex-start" maxW="80%">
      <Box mr={3} mt={1}>
        <Box p={2} bg="green.500" borderRadius="full">
          <Bot size={16} color="white" />
        </Box>
      </Box>

      <Box
        fontSize="md"
        color="white"
        width="100%"
        overflowWrap="anywhere"
        whiteSpace="pre-wrap"
        css={{
          '& p': { marginBottom: '0.75rem' },
          '& h1, & h2, & h3': {
            fontWeight: 'bold',
            marginTop: '1rem',
            marginBottom: '0.5rem',
          },
          '& ul, & ol': {
            paddingLeft: '1.5rem',
            marginBottom: '0.75rem',
          },
          '& li': { marginBottom: '0.25rem' },
          '& blockquote': {
            borderLeft: '4px solid #ccc',
            paddingLeft: '1rem',
            fontStyle: 'italic',
            color: '#ccc',
            marginBottom: '0.75rem',
          },
          '& pre': {
            overflowX: 'auto',
            maxWidth: '100%',
          },
          '& code': {
            background: '#1a1a1a',
            padding: '0.2rem 0.4rem',
            borderRadius: '0.3rem',
            fontSize: '0.9rem',
            fontFamily: 'monospace',
          },
        }}
      >
        {msg.sender === "assistant" && idx === messages.length - 1 && sending && (
          <TypingBubble />
        )}

        <ReactMarkdown components={{ code: CodeBlock }}>
          {msg.content}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
};

export default AIResponse;
