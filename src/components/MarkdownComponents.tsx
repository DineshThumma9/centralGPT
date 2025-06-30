// src/components/MarkdownComponents.tsx
import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { Check, Copy } from "lucide-react";
import React, { type ElementType } from "react";
import { codeBlockContainer, codeBlockContent, codeBlockHeader, inlineCode } from "./AIResponse";

interface ReactMarkdownNode {
    type?: string;
    props?: {
        children?: React.ReactNode;
        [key: string]: unknown;
    };
    children?: React.ReactNode;
}

interface CodeComponentProps {
    node?: ReactMarkdownNode;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
    idx: number;
    copiedCodeBlocks: Record<string, boolean>;
    onCodeBlockCopy: (code: string, blockId: string) => void;
}

interface MarkdownComponentProps {
    children: React.ReactNode;
}

const CodeComponent = ({
    inline,
    className,
    children,
    idx,
    copiedCodeBlocks,
    onCodeBlockCopy,
    ...props
}: CodeComponentProps) => {
    const match = /language-(\w+)/.exec(className || '');

    const getTextContent = (node: React.ReactNode | ReactMarkdownNode): string => {
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return node.toString();
        if (Array.isArray(node)) return node.map(getTextContent).join('');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (node && typeof node === 'object' && 'props' in node && node.props && 'children' in node.props) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return getTextContent(node.props.children);
        }
        return '';
    };

    const codeString = getTextContent(children).replace(/\n$/, '');
    const blockId = `${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    if (inline) {
        return (
            <Box {...inlineCode} {...props}>
                {children}
            </Box>
        );
    }

    return (
        <Box {...codeBlockContainer}>
            <Flex {...codeBlockHeader}>
                <Text
                    fontSize="xs"
                    color="white"
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
                    color={copiedCodeBlocks[blockId] ? "purple.200" : "white"}
                    onClick={() => onCodeBlockCopy(codeString, blockId)}
                    _hover={{
                        bg: "rgba(139, 92, 246, 0.3)",
                        opacity: 1,
                        transform: "scale(1.05)"
                    }}
                    _active={{ transform: "scale(0.95)" }}
                >
                    {copiedCodeBlocks[blockId] ? (
                        <Check size={14} />
                    ) : (
                        <Copy size={14} />
                    )}
                </IconButton>
            </Flex>

            <Box {...codeBlockContent}>
                <Box
                    as={"code" as ElementType}
                    className={className}
                    fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
                    fontSize="13px"
                    lineHeight="1.5"
                    color="purple.100"
                    {...props}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

// Omit the problematic props from CodeComponentProps for the component function
type CodeComponentFunctionProps = Omit<CodeComponentProps, 'idx' | 'copiedCodeBlocks' | 'onCodeBlockCopy'>;

export const createMarkdownComponents = (
    idx: number,
    copiedCodeBlocks: Record<string, boolean>,
    onCodeBlockCopy: (code: string, blockId: string) => void
) => ({
    code: (props: CodeComponentFunctionProps) => (
        <CodeComponent
            {...props}
            idx={idx}
            copiedCodeBlocks={copiedCodeBlocks}
            onCodeBlockCopy={onCodeBlockCopy}
        />
    ),
    p: ({ children }: MarkdownComponentProps) => (
        <Text mb={3} lineHeight="1.7" wordBreak="break-word" color="purple.50">
            {children}
        </Text>
    ),
    h1: ({ children }: MarkdownComponentProps) => (
        <Text as="h1" fontSize="xl" fontWeight="bold" mb={3} mt={4} color="purple.200">
            {children}
        </Text>
    ),
    h2: ({ children }: MarkdownComponentProps) => (
        <Text as="h2" fontSize="lg" fontWeight="bold" mb={2} mt={3} color="purple.200">
            {children}
        </Text>
    ),
    h3: ({ children }: MarkdownComponentProps) => (
        <Text as="h3" fontSize="md" fontWeight="bold" mb={2} mt={2} color="purple.200">
            {children}
        </Text>
    ),
    ul: ({ children }: MarkdownComponentProps) => (
        <Box as="ul" ml={4} mb={3} color="purple.50">
            {children}
        </Box>
    ),
    ol: ({ children }: MarkdownComponentProps) => (
        <Box as="ol" ml={4} mb={3} color="purple.50">
            {children}
        </Box>
    ),
    li: ({ children }: MarkdownComponentProps) => (
        <Box as="li" mb={1} color="purple.50">
            {children}
        </Box>
    ),
    blockquote: ({ children }: MarkdownComponentProps) => (
        <Box
            as="blockquote"
            borderLeft="4px solid"
            borderColor="purple.400"
            pl={4}
            py={2}
            my={3}
            bg="rgba(139, 92, 246, 0.1)"
            borderRadius="md"
            color="purple.100"
        >
            {children}
        </Box>
    ),
    strong: ({ children }: MarkdownComponentProps) => (
        <Text as="strong" color="purple.200" fontWeight="bold">
            {children}
        </Text>
    ),
    em: ({ children }: MarkdownComponentProps) => (
        <Text as="em" color="purple.200" fontStyle="italic">
            {children}
        </Text>
    ),
});