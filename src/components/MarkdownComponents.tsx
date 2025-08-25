// src/components/MarkdownComponents.tsx

"use client";

import {
    Blockquote,
    Box,
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
import { colors, typography, borderRadius, spacing, commonStyles } from "../theme/styleDefinitions";

interface CodeComponentProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  idx: number;
  copiedCodeBlocks: Record<string, boolean>;
  onCodeBlockCopy: (code: string, blockId: string) => void;
  themeColors: any;
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
  children,
  themeColors
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
        variant="subtle"
        size="sm"
        bg={themeColors.background.code}
        color={themeColors.text.code}
        px={2}
        py={1}
        borderRadius={borderRadius.sm}
        fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
        fontSize="14px"
        whiteSpace="normal"
        wordBreak="keep-all"
        display="inline"
        verticalAlign="baseline"
      >
        {children}
      </Code>
    );
  }

  // Plain text block
  if (language === "plaintext") {
    return (
        <Text
          color={themeColors.text.primary}
          lineHeight="1.6"
          fontSize="14px"
          whiteSpace="pre-wrap"
          bg={themeColors.background.code}
          p={3}
          borderRadius={borderRadius.md}
          fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace"
          css={{
            wordBreak: "break-word",
            overflowWrap: "break-word"
          }}
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
  onCodeBlockCopy: (code: string, blockId: string) => void,
  themeColors: any
): Components => ({
  code: (props) => (
    <CodeComponent
      {...props}
      idx={idx}
      copiedCodeBlocks={copiedCodeBlocks}
      onCodeBlockCopy={onCodeBlockCopy}
      themeColors={themeColors}
    />
  ),
  p: ({ children }) => (
    <Text
      fontSize="16px"
      lineHeight="1.7"
      mb={4}
      color={themeColors.text.primary}
      whiteSpace="pre-wrap"
      overflowWrap="break-word"
      wordBreak="normal"
    >
      {children}
    </Text>
  ),
  h1: ({ children }) => (
    <Text
      as="h1"
      fontSize="24px"
      fontWeight="700"
      mb={5}
      mt={8}
      color={themeColors.text.primary}
      borderBottom="2px solid"
      borderColor={themeColors.border.accent}
      pb={2}
      lineHeight="1.3"
    >
      {children}
    </Text>
  ),

  h2: ({ children }) => (
    <Text
      as="h2"
      fontSize="20px"
      fontWeight="600"
      mb={4}
      mt={6}
      color={themeColors.text.primary}
      lineHeight="1.4"
    >
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text
      as="h3"
      fontSize="18px"
      fontWeight="600"
      mb={3}
      mt={5}
      color={themeColors.text.primary}
      lineHeight="1.4"
    >
      {children}
    </Text>
  ),
  ol: ({ children }) => (
    <List.Root as="ol" mb={4} pl={6} color={themeColors.text.primary}>
      <Box css={{ "& li": { marginBottom: "4px" } }}>
        {children}
      </Box>
    </List.Root>
  ),
  ul: ({ children }) => (
    <List.Root as="ul" mb={4} pl={6} color={themeColors.text.primary}>
      <Box css={{ "& li": { marginBottom: "4px" } }}>
        {children}
      </Box>
    </List.Root>
  ),
  li: ({ children }) => (
    <List.Item 
      mb={1} 
      color={themeColors.text.primary}
      lineHeight="1.6"
      overflowWrap="break-word"
      wordBreak="normal"
    >
      {children}
    </List.Item>
  ),
  br: () => <br />,



  blockquote: ({ children }) => (
    <Blockquote.Root
      bg={themeColors.background.muted}
      borderRadius={borderRadius.md}
      color={themeColors.text.secondary}
      my={4}
      pl={4}
      pr={4}
      py={3}
      borderLeft="4px solid"
      borderColor={themeColors.border.accent}
      fontSize="16px"
      lineHeight="1.6"
      fontStyle="italic"
    >
      <Blockquote.Content>
        {children}
      </Blockquote.Content>
    </Blockquote.Root>
  ),

  strong: ({ children }) => (
    <Text as="strong" fontWeight="600" color={themeColors.text.primary} display="inline">
      {children}
    </Text>
  ),
  
  em: ({ children }) => (
    <Em color={themeColors.text.primary} fontStyle="italic" display="inline">
      {children}
    </Em>
  ),

  a: ({ children, href, ...props }) => (
    <a
      href={href}
      style={{
        color: themeColors.background.accent,
        textDecoration: "underline",
        display: "inline",
        cursor: "pointer"
      }}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={(e) => {
        e.currentTarget.style.color = themeColors.border.accent;
        e.currentTarget.style.textDecoration = "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = themeColors.background.accent;
        e.currentTarget.style.textDecoration = "underline";
      }}
      {...props}
    >
      {children}
    </a>
  ),

  // strong: ({ children }) => (
  //   <Text as="strong" fontSize={24} color={themeColors.text.secondary} fontWeight={typography.fontWeight.bold}>
  //     {children}
  //   </Text>
  // ),
  // em: ({ children }) => (
  //   <Em color={themeColors.text.secondary} fontStyle="italic">
  //     {children}
  //   </Em>
  // ),

table: ({ children }) => (
  <Table.Root
    size="sm"
    my={spacing.lg}
    css={{
      borderRadius: borderRadius.md,
      overflow: "hidden",
      border: "1px solid",
      borderColor: colors.border.default,
      bg: themeColors.background.card,
      width: "100%"
    }}
  >
    {children}
  </Table.Root>
),

caption: ({ children }) => (
  <Table.Caption
    color={themeColors.text.secondary}
    fontSize={typography.fontSize.sm}
    textAlign="left"
    p={spacing.sm}
    bg={themeColors.background.muted}
  >
    {children}
  </Table.Caption>
),
// span: ({ children }) => (
//   <Span color={themeColors.text.accent}>
//     {children}
//   </Span>
// ),
// mark: ({ children }) => (
//   <Mark bg={themeColors.background.highlight} color={themeColors.text.primary}>
//     {children}
//   </Mark>
// ),
dl: ({ children }) => (
  <DataList.Root my={spacing.md}>
    {children}
  </DataList.Root>
),
dt: ({ children }) => (
  <DataList.ItemLabel color={themeColors.text.secondary} fontWeight={typography.fontWeight.bold}>
    {children}
  </DataList.ItemLabel>
),
dd: ({ children }) => (
  <DataList.ItemValue color={themeColors.text.accent} mb={spacing.sm}>
    {children}
  </DataList.ItemValue>
),

thead: ({ children }) => (
  <Table.Header
    bg={themeColors.background.muted}
    color={themeColors.text.secondary}
    fontWeight={typography.fontWeight.bold}
  >
    {children}
  </Table.Header>
),

tbody: ({ children }) => (
  <Table.Body
    css={{
      "& tr:nth-of-type(odd)": { bg: themeColors.background.subtle },
      "& tr:nth-of-type(even)": { bg: "transparent" }
    }}
    color={themeColors.text.accent}
  >
    {children}
  </Table.Body>
),

tfoot: ({ children }) => (
  <Table.Footer bg={themeColors.background.muted} color={themeColors.text.muted}>
    {children}
  </Table.Footer>
),

tr: ({ children }) => (
  <Table.Row
    bg={themeColors.background.card}
    _hover={{ bg: themeColors.background.hover }}
    borderBottom="1px solid"
    borderColor={colors.border.default}
  >
    {children}
  </Table.Row>
),

th: ({ children }) => (
  <Table.ColumnHeader
    color={themeColors.text.secondary}
    fontWeight={typography.fontWeight.bold}
    borderBottom="2px solid"
    borderColor={themeColors.border.accent}
    p={spacing.md}
    textAlign="left"
  >
    {children}
  </Table.ColumnHeader>
),

td: ({ children }) => (
  <Table.Cell
    color={themeColors.text.primary}
    borderBottom="1px solid"
    borderColor={colors.border.default}
    p={spacing.md}
  >
    {children}
  </Table.Cell>
),

colgroup: ({ children }) => <Table.ColumnGroup>{children}</Table.ColumnGroup>,
col: ({ children }) => <Table.Column>{children}</Table.Column>

});
