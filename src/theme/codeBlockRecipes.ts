

// theme/recipes/codeBlockRecipes.ts
import { defineSlotRecipe } from "@chakra-ui/react";

export const codeBlockRecipes = defineSlotRecipe({
  slots: ["container", "header", "content", "copyButton", "inline"],
  base: {
    container: {
      position: "relative",
      borderRadius: "lg",
      overflow: "hidden",
      marginY: 3,
      border: "2px solid",
      borderColor: "rgba(139, 92, 246, 0.4)",
      maxWidth: "100%",
      transition: "border-color 0.2s",
      boxShadow: "0 2px 15px rgba(147, 51, 234, 0.2)",
      _hover: {
        borderColor: "rgba(139, 92, 246, 0.6)",
        '& .copy-button': {
          opacity: 1,
        },
      },
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingX: 4,
      paddingY: 2,
      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8))",
      borderBottom: "1px solid",
      borderColor: "rgba(139, 92, 246, 0.4)",
    },
    content: {
      padding: 4,
      overflow: "auto",
      margin: 0,
      background: "rgba(15, 15, 25, 0.9)",
      maxHeight: "400px",
    },
    copyButton: {
      className: "copy-button",
      opacity: 0,
      transition: "opacity 0.2s",
      size: "sm",
      variant: "ghost",
      color: "white",
    },
    inline: {
      background: "rgba(139, 92, 246, 0.2)",
      paddingX: 2,
      paddingY: 1,
      borderRadius: "md",
      fontSize: "13px",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace",
      color: "purple.200",
      border: "1px solid",
      borderColor: "rgba(139, 92, 246, 0.3)",
    },
  },
});
