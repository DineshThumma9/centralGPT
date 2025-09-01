import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { badgeRecipe } from "./theme/BadgeTheme.ts";
import { menuSlots } from "./theme/menuhelper.ts";
import { dialogcust } from "./theme/dialogcust.ts";
import { messageRecipes } from "./theme/file.ts";
import { editableRecipes } from "./theme/editableRecipes.ts";
import { codeBlockRecipes } from "./theme/codeBlockRecipes.ts";
import { componentRecipes } from "./theme/componentRecipes.ts";

// Optimized Chakra UI v3 Theme System
// Using semantic tokens and built-in color mode support

// 1. Design Tokens
const tokens = {
  colors: {
    // Brand colors - Green theme
    brand: {
      50: { value: "rgba(34, 197, 94, 0.05)" },
      100: { value: "rgba(34, 197, 94, 0.1)" },
      200: { value: "rgba(34, 197, 94, 0.2)" },
      300: { value: "rgba(34, 197, 94, 0.3)" },
      400: { value: "rgba(34, 197, 94, 0.4)" },
      500: { value: "rgba(34, 197, 94, 0.5)" },
      600: { value: "#22c55e" },
      700: { value: "#16a34a" },
      800: { value: "#15803d" },
      900: { value: "#166534" },
      950: { value: "#14532d" },
    },
    // Emerald colors for accents
    emerald: {
      50: { value: "rgba(16, 185, 129, 0.05)" },
      100: { value: "rgba(16, 185, 129, 0.1)" },
      200: { value: "rgba(16, 185, 129, 0.2)" },
      300: { value: "rgba(16, 185, 129, 0.3)" },
      400: { value: "rgba(16, 185, 129, 0.4)" },
      500: { value: "#10b981" },
      600: { value: "#059669" },
      700: { value: "#047857" },
      800: { value: "#065f46" },
      900: { value: "#064e3b" },
    },
  },
  fonts: {
    heading: { value: "'Red Rose', sans-serif" },
    body: { value: "'Jaldi', sans-serif" },
  },
  fontSizes: {
    xs: { value: "12px" },
    sm: { value: "14px" },
    md: { value: "16px" },
    lg: { value: "18px" },
    xl: { value: "20px" },
    "2xl": { value: "24px" },
    "3xl": { value: "30px" },
  },
  fontWeights: {
    normal: { value: "400" },
    medium: { value: "500" },
    semibold: { value: "600" },
    bold: { value: "700" },
  },
  lineHeights: {
    tight: { value: "1.25" },
    normal: { value: "1.5" },
    relaxed: { value: "1.6" },
    loose: { value: "1.7" },
  },
  spacing: {
    xs: { value: "4px" },
    sm: { value: "8px" },
    md: { value: "16px" },
    lg: { value: "24px" },
    xl: { value: "32px" },
    xxl: { value: "48px" },
  },
  radii: {
    sm: { value: "4px" },
    md: { value: "8px" },
    lg: { value: "12px" },
    xl: { value: "16px" },
    xxl: { value: "22px" },
    full: { value: "9999px" },
  },
};

// 2. Semantic Tokens - Automatically handles light/dark mode
const semanticTokens = {
  colors: {
    // Primary brand colors
    "brand.solid": {
      value: {
        base: "brand.700",
        _dark: "brand.600"
      }
    },
    "brand.subtle": {
      value: {
        base: "brand.100",
        _dark: "brand.900"
      }
    },
    "brand.emphasized": {
      value: {
        base: "brand.800",
        _dark: "brand.500"
      }
    },

    // Background colors
    "bg.canvas": {
      value: {
        base: "#f5f5f5",
        _dark: "#121212"
      }
    },
    "bg.surface": {
      value: {
        base: "white", 
        _dark: "#1a1a1a"
      }
    },
    "bg.panel": {
      value: {
        base: "white",
        _dark: "#1e1e1e"
      }
    },
    "bg.subtle": {
      value: {
        base: "gray.50",
        _dark: "gray.800"
      }
    },
    "bg.muted": {
      value: {
        base: "gray.100",
        _dark: "gray.700"
      }
    },
    "bg.emphasized": {
      value: {
        base: "gray.100",
        _dark: "gray.600"
      }
    },

    // Text colors
    "fg.default": {
      value: {
        base: "#1a1a1a",
        _dark: "#ffffff"
      }
    },
    "fg": {
      value: {
        base: "#1a1a1a",
        _dark: "#ffffff"
      }
    },
    "fg.muted": {
      value: {
        base: "gray.600",
        _dark: "gray.300"
      }
    },
    "fg.subtle": {
      value: {
        base: "gray.500",
        _dark: "gray.400"
      }
    },
    "fg.inverted": {
      value: {
        base: "#ffffff",
        _dark: "#000000"
      }
    },

    // Border colors
    "border.default": {
      value: {
        base: "gray.200",
        _dark: "gray.600"
      }
    },
    "border": {
      value: {
        base: "gray.300",
        _dark: "gray.500"
      }
    },
    "border.subtle": {
      value: {
        base: "gray.200",
        _dark: "gray.700"
      }
    },
    "border.emphasized": {
      value: {
        base: "gray.300",
        _dark: "gray.500"
      }
    },
    "border.accent": {
      value: {
        base: "brand.600",
        _dark: "brand.500"
      }
    },

    // Interactive states
    "colorPalette.solid": {
      value: {
        base: "brand.700",
        _dark: "brand.600"
      }
    },
    "colorPalette.contrast": {
      value: {
        base: "black",
        _dark: "white"
      }
    },
    
    // Green hover states for icons (no background by default, green on hover)
    "brand.hover": {
      value: {
        base: "rgba(34, 197, 94, 0.1)",  // Light green for light mode
        _dark: "rgba(34, 197, 94, 0.2)"  // Slightly more intense for dark mode
      }
    },
    "brand.active": {
      value: {
        base: "rgba(34, 197, 94, 0.15)",  // Slightly more intense for active state
        _dark: "rgba(34, 197, 94, 0.25)"
      }
    },
  }
};

// 3. Global Styles - Clean and minimal
const globalCss = {
  "*": {
    transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
  },
  body: {
    bg: "bg.canvas",
    color: "fg.default",
    fontFamily: "fonts.body",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    lineHeight: "normal",
  },
  code: {
    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  // Custom scrollbar
  "::-webkit-scrollbar": {
    width: "6px",
    height: "6px",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "brand.600",
    borderRadius: "sm",
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
};

// 4. Component Recipes - Enhanced with semantic tokens
const enhancedRecipes = {
  // Badge recipe
  badge: badgeRecipe,

  // Button recipe using semantic tokens
  button: {
    base: {
      fontWeight: "semibold",
      borderRadius: "lg",
      transition: "all 0.2s",
    },
    variants: {
      variant: {
        solid: {
          bg: "colorPalette.solid",
          color: "colorPalette.contrast",
          _hover: {
            bg: "colorPalette.emphasized",
          },
        },
        outline: {
          borderWidth: "1px",
          borderColor: "colorPalette.solid",
          color: "colorPalette.solid",
          _hover: {
            bg: "colorPalette.subtle",
          },
        },
        ghost: {
          color: "colorPalette.solid",
          _hover: {
            bg: "colorPalette.subtle",
          },
        },
      },
    },
    defaultVariants: {
      variant: "solid",
      colorPalette: "brand",
    },
  },

  // Card recipe
  card: {
    base: {
      bg: "bg.surface",
      borderRadius: "lg",
      border: "1px solid",
      borderColor: "border.default",
      p: "4",
    },
    variants: {
      variant: {
        elevated: {
          boxShadow: "sm",
        },
        outline: {
          borderColor: "border.emphasized",
        },
        subtle: {
          bg: "bg.subtle",
          border: "none",
        },
      },
    },
    defaultVariants: {
      variant: "elevated",
    },
  },

  // Include existing recipes
  ...componentRecipes,
};

// 5. Theme Configuration
const config = defineConfig({
  strictTokens: true,
  theme: {
    tokens,
    semanticTokens,
    recipes: enhancedRecipes,
    slotRecipes: {
      menuHelper: menuSlots,
      dialogHelper: dialogcust,
      message: messageRecipes,
      codeBlock: codeBlockRecipes,
      editable: editableRecipes,
    },
  },
  globalCss,
});

// Create and export the system
const system = createSystem(defaultConfig, config);
export default system;
