// src/theme/componentRecipes.ts
import { defineRecipe } from "@chakra-ui/react";
import { componentStyles, commonStyles, getButtonVariant } from "./styleDefinitions";

// Chat Message Recipe
export const chatMessageRecipe = defineRecipe({
  className: "chat-message",
  base: componentStyles.assistantMessage,
  variants: {
    type: {
      user: componentStyles.userMessage,
      assistant: componentStyles.assistantMessage,
    },
  },
  defaultVariants: {
    type: "assistant",
  },
});

// Button Recipe
export const buttonRecipe = defineRecipe({
  className: "button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "lg",
    fontWeight: "semibold",
    transition: "all 0.2s",
    cursor: "pointer",
    outline: "none",
  },
  variants: {
    variant: {
      primary: getButtonVariant("primary"),
      ghost: getButtonVariant("ghost"),
      danger: getButtonVariant("danger"),
    },
    size: {
      sm: {
        px: "3",
        py: "2",
        fontSize: "sm",
      },
      md: {
        px: "4",
        py: "2.5",
        fontSize: "md",
      },
      lg: {
        px: "6",
        py: "3",
        fontSize: "lg",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

// Card Recipe
export const cardRecipe = defineRecipe({
  className: "card",
  base: commonStyles.glassCard,
  variants: {
    variant: {
      default: {},
      elevated: {
        boxShadow: "lg",
      },
      outlined: {
        border: "1px solid",
        borderColor: "green.300",
        bg: "transparent",
      },
    },
    size: {
      sm: {
        p: "3",
      },
      md: {
        p: "4",
      },
      lg: {
        p: "6",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Input Recipe
export const inputRecipe = defineRecipe({
  className: "input",
  base: {
    ...commonStyles.input,
    width: "100%",
    px: "3",
    py: "2",
  },
  variants: {
    variant: {
      default: {},
      filled: {
        bg: "rgba(255, 255, 255, 0.05)",
        border: "none",
      },
    },
    size: {
      sm: {
        px: "2",
        py: "1.5",
        fontSize: "sm",
      },
      md: {
        px: "3",
        py: "2",
        fontSize: "md",
      },
      lg: {
        px: "4",
        py: "3",
        fontSize: "lg",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Sidebar Recipe
export const sidebarRecipe = defineRecipe({
  className: "sidebar",
  base: componentStyles.sidebarContainer,
  variants: {
    collapsed: {
      true: {
        width: "60px",
      },
      false: {
        width: "300px",
      },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

// Session Item Recipe
export const sessionItemRecipe = defineRecipe({
  className: "session-item",
  base: componentStyles.sessionItem,
  variants: {
    state: {
      default: {},
      active: {
        bg: "green.200",
        borderColor: "green.400",
      },
      hover: {
        bg: "green.100",
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

// File Item Recipe
export const fileItemRecipe = defineRecipe({
  className: "file-item",
  base: componentStyles.fileItem,
  variants: {
    type: {
      pdf: {
        borderLeft: "4px solid red.400",
      },
      image: {
        borderLeft: "4px solid blue.400",
      },
      text: {
        borderLeft: "4px solid green.400",
      },
      other: {
        borderLeft: "4px solid gray.400",
      },
    },
  },
  defaultVariants: {
    type: "other",
  },
});

// Modal Recipe
export const modalRecipe = defineRecipe({
  className: "modal",
  base: {},
  variants: {
    size: {
      sm: { maxW: "400px" },
      md: { maxW: "600px" },
      lg: { maxW: "800px" },
      xl: { maxW: "1200px" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Text Recipe for consistent typography
export const textRecipe = defineRecipe({
  className: "text",
  base: {},
  variants: {
    variant: {
      heading: commonStyles.heading,
      body: commonStyles.bodyText,
      muted: commonStyles.mutedText,
    },
    size: {
      xs: { fontSize: "xs" },
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
      xl: { fontSize: "xl" },
      "2xl": { fontSize: "2xl" },
    },
  },
  defaultVariants: {
    variant: "body",
    size: "md",
  },
});

export const componentRecipes = {
  chatMessage: chatMessageRecipe,
  button: buttonRecipe,
  card: cardRecipe,
  input: inputRecipe,
  sidebar: sidebarRecipe,
  sessionItem: sessionItemRecipe,
  fileItem: fileItemRecipe,
  modal: modalRecipe,
  text: textRecipe,
};
