import { useState } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toaster } from "./ui/toaster.tsx";

const CodeBlock = ({ children, className }: any) => {
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
      <Box
        position="relative"
        my={4}
        w="full"
        maxW="100%"
        borderRadius="md"
        bg="gray.800"
        overflow="hidden"
      >
        <Flex
          justify="space-between"
          align="center"
          bg="gray.900"
          px={4}
          py={2}
          borderTopRadius="md"
        >
          <Text fontSize="sm" color="gray.300" fontFamily="mono">
            {language}
          </Text>
          <IconButton
            aria-label="Copy code"

            size="sm"
            variant="ghost"
            colorScheme={copied ? "green" : "gray"}
            onClick={handleCopy}
            _hover={{ bg: "gray.700" }}
          >
             copied ? <Check size={16} /> : <Copy size={16} />
          </IconButton>
        </Flex>
        <Box
          overflowX="auto"
          maxW="100%"
        >
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1rem',
              overflowX: 'auto',
              fontSize: '0.85rem',
              background: 'transparent',
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              maxHeight: '400px',
              overflowY: 'auto',
              maxWidth: '100%',
              whiteSpace: 'pre',
              wordBreak: 'normal'
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </Box>
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
      fontSize="0.85rem"
      fontFamily="mono"
      color="white"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      display="inline"
    >
      {children}
    </Box>
  );
};

export default CodeBlock;