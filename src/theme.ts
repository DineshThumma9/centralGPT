import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";
import {badgeRecipe} from "./theme/BadgeTheme.ts";
import {menuSlots} from "./theme/menuhelper.ts";
import {dialogcust} from "./theme/dialogcust.ts";
import {messageRecipes} from "./theme/file.ts";
import {editableRecipes} from "./theme/editableRecipes.ts";
import {codeBlockRecipes} from "./theme/codeBlockRecipes.ts";
// 1. Design Tokens


const tokens = {
  colors: {
    black: { value: '#000000' },
    white: { value: '#FFFFFF' },
    gray: {
      500: { value: 'rgba(255, 255, 255, 0.72)' },
    },
    brand: {
      primary: { value: 'purple.200' },
    },
    whiteAlpha: {
      200: { value: 'rgba(255, 255, 255, 0.08)' },
    },
  },
  fonts: {
    heading: { value: "'Red Rose', sans-serif" },
    body: { value: "'Jaldi', sans-serif" },
  },
  fontSizes: {
    sm: { value: '12px' },
    md: { value: '16px' },
    lg: { value: '28px' },
  },
  fontWeights: {
    normal: { value: '400' },
    bold: { value: '700' },
  },
  lineHeights: {
    base: { value: '1.69' },
    tight: { value: '1.25' },
  },
};

// 2. Semantic Tokens
const semanticTokens = {
  colors: {
    "app.bg": { value: "linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)" },
    "app.text": { value: "purple.100" },
    "app.text.secondary": { value: "linear-gradient(135deg, purple.500, violet.500)" },
  },
};

// 3. Global Styles (includes font smoothing + base font logic)
const globalCss = {
    body: {
        bg: "app.bg",
        color: "app.text",
        fontFamily: "fonts.body",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        margin: "0",
    },
    code: {
        fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
    },

    "::webkit-scrollbars": {
        width: "2px",
        height: "5px",
    },



       '::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(147, 51, 234, 0.3)',
            borderRadius: '3px',
        },



      '::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
        },
    '*': {
        scrollbarColor: '#718096 transparent',
        scrollbarWidth: 'thin',
    },

    // Add global text styles
    ".text-heading": {
        fontFamily: "fonts.heading",
        fontWeight: "fontWeights.normal",
        fontSize: "fontSizes.lg",
        lineHeight: "lineHeights.tight",
        color: "app.text",
    },
    ".text-body": {
        fontFamily: "fonts.body",
        fontWeight: "fontWeights.normal",
        fontSize: "fontSizes.md",
        lineHeight: "lineHeights.base",
        color: "app.text",
    },
    ".text-sidebar": {
        fontFamily: "fonts.body",
        fontWeight: "fontWeights.normal",
        fontSize: "fontSizes.md",
        lineHeight: "lineHeights.base",
        color: "app.text",
    },
    ".text-sidebar-small": {
        fontFamily: "fonts.heading",
        fontWeight: "fontWeights.bold",
        fontSize: "fontSizes.sm",
        lineHeight: "lineHeights.tight",
        color: "app.text.secondary",
    },
    ".button": {
        fontWeight: "fontWeights.bold",
        borderRadius: "md",
        color: "app.text",
        "&.solid": {
            bg: "brand.primary",
            color: "white",
            "&:hover": {
                opacity: 0.9,
            },
        },
        "&.ghost": {
            bg: "transparent",
            color: "app.text",
            "&:hover": {
                bg: "whiteAlpha.200",
            },
        },
    },
};





const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    recipes: {
      badge: badgeRecipe,
    },
    slotRecipes: {
      menuHelper: menuSlots,
      dialogHelper: dialogcust,
      message: messageRecipes,
      codeBlock: codeBlockRecipes,
      editable: editableRecipes,
    },
  },
  globalCss: {
    ...globalCss,

  },
});

const system = createSystem(defaultConfig, config);
export default system;