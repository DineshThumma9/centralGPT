import {
  Box,
  Center,
  Heading,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import sessionStore from "../store/sessionStore.ts";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { Message } from "../entities/Message.ts";

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

  // Scroll to bottom on message change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Box
      ref={containerRef}
      flex="1"
      overflowY="auto"
      w="full"
      maxW="80%"
      mx="auto"
      px={4}
      bg="app.bg"
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#404040',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#505050',
        },
      }}
    >
      {messages.length === 0 ? (
        <Center h="full">
          <VStack gap={4}>
            <Heading
              fontSize="lg"
              color="app.text.secondary"
              fontWeight="medium"
            >
              Start a conversation
            </Heading>
            <Heading
              fontSize="sm"
              color="app.text.muted"
              textAlign="center"
              maxW="breakpoint-lg"
            >
              Choose a model and start chatting. Your messages will appear here.
            </Heading>
          </VStack>
        </Center>
      ) : (
        <VStack gap={4} py={6} align="stretch">
          {messages.map((msg, idx) => (
            <Flex
              key={msg.message_id || idx}
              justify={msg.sender === "user" ? "flex-end" : "center"}
            >
              <Box
                bg={msg.sender === "user" ? "app.accent" : "transparent"}
                color="white"
                px={2}
                py={1}
                borderRadius={msg.sender === "user" ? "30px" : "12px"}
                boxShadow="md"
                maxW="80%"
                transition="all 0.2s ease-in-out"
                _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
              >
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {msg.content}
                </ReactMarkdown>
              </Box>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Response;
