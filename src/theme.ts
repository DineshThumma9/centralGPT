import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";
import {badgeRecipe} from "./theme/BadgeTheme.ts";
import {menuSlots} from "./theme/menuhelper.ts";
import {dialogcust} from "./theme/dialogcust.ts";
import {messageRecipes} from "./theme/file.ts";
import {editableRecipes} from "./theme/editableRecipes.ts";
import {codeBlockRecipes} from "./theme/codeBlockRecipes.ts";
import {colors, spacing, borderRadius, typography, commonStyles} from "./theme/styleDefinitions.ts";
import {componentRecipes} from "./theme/componentRecipes.ts";
// 1. Design Tokens


const tokens = {
  colors: {
    black: { value: '#000000' },
    white: { value: '#FFFFFF' },
    gray: {
      500: { value: 'rgba(255, 255, 255, 0.72)' },
    },
    brand: {
      primary: { value: 'green.200' },
    },
    whiteAlpha: {
      200: { value: 'rgba(255, 255, 255, 0.08)' },
    },
    // Add centralized color tokens
    green: {
      50: { value: colors.green[50] },
      100: { value: colors.green[100] },
      200: { value: colors.green[200] },
      300: { value: colors.green[300] },
      400: { value: colors.green[400] },
      500: { value: colors.green[500] },
      solid: { value: colors.green.solid },
      light: { value: colors.green.light },
      dark: { value: colors.green.dark },
    },
    emerald: {
      50: { value: colors.emerald[50] },
      100: { value: colors.emerald[100] },
      200: { value: colors.emerald[200] },
      300: { value: colors.emerald[300] },
      400: { value: colors.emerald[400] },
      500: { value: colors.emerald[500] },
      solid: { value: colors.emerald.solid },
    },
  },
  fonts: {
    heading: { value: "'Red Rose', sans-serif" },
    body: { value: "'Jaldi', sans-serif" },
  },
  fontSizes: {
    xs: { value: typography.fontSize.xs },
    sm: { value: typography.fontSize.sm },
    md: { value: typography.fontSize.md },
    lg: { value: typography.fontSize.lg },
    xl: { value: typography.fontSize.xl },
    "2xl": { value: typography.fontSize["2xl"] },
    "3xl": { value: typography.fontSize["3xl"] },
  },
  fontWeights: {
    normal: { value: typography.fontWeight.normal },
    medium: { value: typography.fontWeight.medium },
    semibold: { value: typography.fontWeight.semibold },
    bold: { value: typography.fontWeight.bold },
  },
  lineHeights: {
    tight: { value: typography.lineHeight.tight },
    normal: { value: typography.lineHeight.normal },
    relaxed: { value: typography.lineHeight.relaxed },
    loose: { value: typography.lineHeight.loose },
  },
  spacing: {
    xs: { value: spacing.xs },
    sm: { value: spacing.sm },
    md: { value: spacing.md },
    lg: { value: spacing.lg },
    xl: { value: spacing.xl },
    xxl: { value: spacing.xxl },
  },
  radii: {
    sm: { value: borderRadius.sm },
    md: { value: borderRadius.md },
    lg: { value: borderRadius.lg },
    xl: { value: borderRadius.xl },
    xxl: { value: borderRadius.xxl },
    full: { value: borderRadius.full },
  },
};

// 2. Semantic Tokens with color mode support
const semanticTokens = {
  colors: {
    "app.bg": {
      value: {
        _light: colors.light.background.body,
        _dark: colors.dark.background.body,
      }
    },
    "app.text": {
      value: {
        _light: colors.light.text.primary,
        _dark: colors.dark.text.primary,
      }
    },
    "app.text.secondary": {
      value: {
        _light: colors.light.text.secondary,
        _dark: colors.dark.text.secondary,
      }
    },
    "app.text.muted": {
      value: {
        _light: colors.light.text.muted,
        _dark: colors.dark.text.muted,
      }
    },
    "app.bg.card": {
      value: {
        _light: colors.light.background.card,
        _dark: colors.dark.background.card,
      }
    },
    "app.bg.hover": {
      value: {
        _light: colors.light.background.hover,
        _dark: colors.dark.background.hover,
      }
    },
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

    // Centralized scrollbar styles
    "::webkit-scrollbars": {
        width: "6px",
        height: "6px",
    },
    '::-webkit-scrollbar-thumb': {
        backgroundColor: colors.green[300],
        borderRadius: borderRadius.sm,
    },
    '::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
    },
    '*': {
        scrollbarColor: `${colors.green[300]} transparent`,
        scrollbarWidth: 'thin',
    },

    // Global utility classes
    ".gradient-bg": commonStyles.gradientBackground,
    ".glass-card": commonStyles.glassCard,
    ".custom-scrollbar": commonStyles.customScrollbar,
    ".fade-in": commonStyles.fadeIn,
    ".slide-in": commonStyles.slideIn,
    ".flex-center": commonStyles.flexCenter,
    ".flex-between": commonStyles.flexBetween,
    
    // Typography classes
    ".text-heading": {
        ...commonStyles.heading,
        fontFamily: "fonts.heading",
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.tight,
    },
    ".text-body": {
        ...commonStyles.bodyText,
        fontFamily: "fonts.body",
        fontSize: typography.fontSize.md,
        lineHeight: typography.lineHeight.normal,
    },
    ".text-muted": commonStyles.mutedText,
    
    // Button classes
    ".btn-primary": commonStyles.primaryButton,
    ".btn-ghost": commonStyles.ghostButton,
    
    // Input classes
    ".input-base": commonStyles.input,
};





const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    recipes: {
      badge: badgeRecipe,
      // Add centralized component recipes
      ...componentRecipes,
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