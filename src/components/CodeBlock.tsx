
// src/components/CodeBlock.tsx
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
        borderRadius="lg"
        bg="linear-gradient(135deg, #2d1b69 0%, #1a0b2e 100%)"
        border="1px solid"
        borderColor="purple.500"
        overflow="hidden"
        boxShadow="0 8px 32px rgba(147, 51, 234, 0.2)"
      >
        <Flex
          justify="space-between"
          align="center"
          bg="rgba(45, 27, 105, 0.8)"
          backdropFilter="blur(10px)"
          px={4}
          py={3}
          borderTopRadius="lg"
          borderBottom="1px solid"
          borderColor="purple.400"
        >
          <Text fontSize="sm" color="purple.200" fontFamily="mono" fontWeight="medium">
            {language}
          </Text>
          <IconButton
            aria-label="Copy code"
            size="sm"
            variant="ghost"
            colorScheme={copied ? "green" : "purple"}
            onClick={handleCopy}
            bg={copied ? "green.600" : "purple.600"}
            color="white"
            _hover={{
              bg: copied ? "green.500" : "purple.500",
              transform: "scale(1.05)"
            }}
            _active={{ transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </IconButton>
        </Flex>
        <Box overflowX="auto" maxW="100%">
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              overflowX: 'auto',
              fontSize: '0.875rem',
              background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 100%)',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
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
      bg="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
      px={3}
      py={1}
      borderRadius="md"
      fontSize="0.875rem"
      fontFamily="mono"
      color="white"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
      display="inline"
      border="1px solid"
      borderColor="purple.400"
      boxShadow="0 2px 8px rgba(147, 51, 234, 0.3)"
    >
      {children}
    </Box>
  );
};

export default CodeBlock;

// ===============================================
