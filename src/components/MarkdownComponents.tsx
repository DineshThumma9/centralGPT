// src/components/MarkdownComponents.tsx

"use client";

import {
    Blockquote,
    Code,
    CodeBlock,
    CodeBlockAdapterProvider,
    createShikiAdapter,
    DataList,
    Em,
    IconButton,
    List,
    Mark,
    Span,
    Table,
    Text
} from "@chakra-ui/react";
import React from "react";
import type {Components} from "react-markdown";
import type {HighlighterGeneric} from "shiki";

interface CodeComponentProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  idx: number;
  copiedCodeBlocks: Record<string, boolean>;
  onCodeBlockCopy: (code: string, blockId: string) => void;
}

const shikiAdapter = createShikiAdapter<HighlighterGeneric<any, any>>({
  async load() {
    const { createHighlighter } = await import("shiki");
    return createHighlighter({
      langs: [
        "tsx",
        "json",
        "bash",
        "py",
        "python",
        "jade",
        "java",
        "javascript",
        "kotlin",
        "typescript",
        "c",
        "c++",
          "dotenv",
          "docker",
          "powershell"
      ],
      themes: ["github-dark", "github-light"]
    });
  }
});

const CodeComponent = ({
  inline,
  className,
  children
}: CodeComponentProps) => {
  const match = /language-(\w+)/.exec(className || "");

  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (React.isValidElement(node) && node.props && "children" in node.props) {
      return getTextContent(node.props.children as React.ReactNode);
    }
    return String(node || "");
  };

  const codeString = getTextContent(children).replace(/\n$/, "");
  const language = match ? match[1] : "plaintext";

  // Inline code
  if (inline) {
    return (
      <Code
        colorPalette="purple"
        variant="subtle"
        size="sm"
        bg="rgba(139, 92, 246, 0.2)"
        color="purple.200"
        px={1}
        py={0.5}
        borderRadius="md"
        fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
      >
        {children}
      </Code>
    );
  }

  // Plain text block
  if (language === "plaintext") {
    return (

        <Text
          color="purple.100"
          lineHeight="1.6"
          fontSize="sm"
          whiteSpace="pre-wrap"
        >
          {codeString}
        </Text>

    );
  }

  // Syntax highlighted code
  return (
    <CodeBlockAdapterProvider value={shikiAdapter}>
      <CodeBlock.Root
        code={codeString}
        language={language}
        colorPalette="purple"
        size="sm"
      >
        <CodeBlock.Header>
          <CodeBlock.Title>{language}</CodeBlock.Title>
          <CodeBlock.CopyTrigger asChild>
            <IconButton variant="ghost" size="2xs">
              <CodeBlock.CopyIndicator />
            </IconButton>
          </CodeBlock.CopyTrigger>
        </CodeBlock.Header>
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlockAdapterProvider>
  );
};

export const createMarkdownComponents = (
  idx: number,
  copiedCodeBlocks: Record<string, boolean>,
  onCodeBlockCopy: (code: string, blockId: string) => void
): Components => ({
  code: (props) => (
    <CodeComponent
      {...props}
      idx={idx}
      copiedCodeBlocks={copiedCodeBlocks}
      onCodeBlockCopy={onCodeBlockCopy}
    />
  ),
  p: ({ children }) => (
    <Text mb={3} lineHeight="1.7" wordBreak="break-word" color="purple.50">
      {children}
    </Text>
  ),
  h1: ({ children }) => (
    <Text
      as="h1"
      fontSize="xl"
      fontWeight="bold"
      mb={3}
      mt={4}
      color="purple.200"
    >
      {children}
    </Text>
  ),

  h2: ({ children }) => (
    <Text
      as="h2"
      fontSize="lg"
      fontWeight="bold"
      mb={2}
      mt={3}
      color="purple.200"
    >
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text
      as="h3"
      fontSize="md"
      fontWeight="bold"
      mb={2}
      mt={2}
      color="purple.200"
    >
      {children}
    </Text>
  ),
  ol: ({ children }) => (
    <List.Root as="ol" mb={1} color="purple.50">
      <List.Item>
        {children}
      </List.Item>

    </List.Root>
  ),
  //   ul: ({ children }) => (
  //   <List.Root as="ul" mb={1} color="purple.50">
  //     <List.Item>
  //       {children}
  //     </List.Item>
  //
  //   </List.Root>
  // ),
  li: ({ children }) => (
    <List.Root as="li" mb={1} color="purple.50">
      <List.Item>
        {children}
      </List.Item>

    </List.Root>
  ),
br: () => <Text as="span" display="block" />,



  blockquote: ({ children }) => (
    <Blockquote.Root
      bg="rgba(139, 92, 246, 0.1)"
      borderRadius="md"
      color="purple.100"
    >
      {children}
    </Blockquote.Root>
  ),

  strong: ({ children }) => (
    <Text as="strong" color="purple.200" fontWeight="bold">
      {children}
    </Text>
  ),
  em: ({ children }) => (
    <Em  color="purple.200" fontStyle="italic">
      {children}
    </Em>
  ),

table: ({ children }) => (
  <Table.Root
    size="sm"

    colorScheme="purple"
    css={{
      borderRadius: "md",
      overflow: "hidden",
      border: "1px solid",
      borderColor: "purple.400",
      bg: "rgba(139, 92, 246, 0.05)"
    }}
  >
    {children}
  </Table.Root>
),

caption: ({ children }) => (
  <Table.Caption
    color="purple.200"
    fontSize="sm"
    textAlign="left"
    p={2}
    bg="rgba(139, 92, 246, 0.1)"
  >
    {children}
  </Table.Caption>
),
span:({children}) => (
      <Span>
          {children}
      </Span>
),
    mark:({children}) => (
      <Mark>
          {children}
      </Mark>
),
    dl:({children}) => (
      <DataList.Root>
          <DataList.Item>
              {children}
          </DataList.Item>
      </DataList.Root>
),
    dt:({children}) => (
      <DataList.ItemLabel>
          {children}
      </DataList.ItemLabel>
),
        dd:({children}) => (
      <DataList.ItemValue>
          {children}
      </DataList.ItemValue>
),

thead: ({ children }) => (
  <Table.Header
    bg="rgba(139, 92, 246, 0.2)"
    color="purple.200"
    fontWeight="bold"
  >
    {children}
  </Table.Header>
),

tbody: ({ children }) => (
  <Table.Body
    css={{
      "& tr:nth-of-type(odd)": { bg: "rgba(139, 92, 246, 0.05)" },
      "& tr:nth-of-type(even)": { bg: "transparent" }
    }}
    color="purple.50"
  >
    {children}
  </Table.Body>
),

tfoot: ({ children }) => (
  <Table.Footer bg="rgba(139, 92, 246, 0.15)" color="purple.300">
    {children}
  </Table.Footer>
),

tr: ({ children }) => (
  <Table.Row
      bg={"rgba(139, 92, 246, 0.1)"}
    _hover={{ bg: "rgba(139, 92, 246, 0.1)" }}
    borderBottom="1px solid"
    borderColor="purple.400"
  >
    {children}
  </Table.Row>
),

th: ({ children }) => (
  <Table.ColumnHeader
    color="purple.200"
    fontWeight="bold"
    borderBottom="2px solid"
    borderColor="purple.400"
  >
    {children}
  </Table.ColumnHeader>
),

td: ({ children }) => (
  <Table.Cell
    color="purple.50"
    borderBottom="1px solid"
    borderColor="purple.400"
  >
    {children}
  </Table.Cell>
),

colgroup: ({ children }) => <Table.ColumnGroup>{children}</Table.ColumnGroup>,
col: ({ children }) => <Table.Column>{children}</Table.Column>

});
