// src/theme/styleDefinitions.ts
// Centralized style definitions to replace inline styles throughout the app

export const colors = {
  green: {
    50: "rgba(34, 197, 94, 0.05)",
    100: "rgba(34, 197, 94, 0.1)",
    200: "rgba(34, 197, 94, 0.2)",
    300: "rgba(34, 197, 94, 0.3)",
    400: "rgba(34, 197, 94, 0.4)",
    500: "rgba(34, 197, 94, 0.5)",
    solid: "#22c55e",        // Medium green
    light: "#4ade80",        // Softer green for dark theme
    dark: "#16a34a",         // Darker green for light theme
    darker: "#15803d",       // Even darker for light theme contrast
    softer: "#34d399",       // Softer for dark theme visibility
  },
  emerald: {
    50: "rgba(16, 185, 129, 0.05)",
    100: "rgba(16, 185, 129, 0.1)",
    200: "rgba(16, 185, 129, 0.2)",
    300: "rgba(16, 185, 129, 0.3)",
    400: "rgba(16, 185, 129, 0.4)",
    500: "rgba(16, 185, 129, 0.5)",
    solid: "#10b981",
  },
  // Light and Dark mode support - Black and White theme
  light: {
    background: {
      primary: "#ffffff",
      card: "rgba(255, 255, 255, 0.95)", // More opaque for better contrast on teal background
      hover: "rgba(233, 236, 239, 0.9)",
      active: "rgba(222, 226, 230, 0.9)",
      body: "#ffffff",
      code: "rgba(248, 249, 250, 0.95)",
      muted: "rgba(233, 236, 239, 0.8)",
      subtle: "rgba(241, 243, 244, 0.9)",
      highlight: "rgba(255, 235, 59, 0.3)",
      accent: "#15803d", // Darker green for light theme - better contrast
    },
    text: {
      primary: "#111827", // Much darker for excellent contrast against teal
      secondary: "#1f2937", // Very dark gray for visibility
      muted: "#374151", // Dark enough to be clearly visible
      accent: "#0f172a", // Nearly black for maximum contrast
      code: "#111827",
      danger: "#991b1b", // Darker red for better visibility
      inverse: "#ffffff",
    },
    border: {
      default: "rgba(222, 226, 230, 0.8)", // Semi-transparent borders
      secondary: "rgba(206, 212, 218, 0.8)",
      focus: "#2d3748", // Darker focus for better visibility
      hover: "rgba(173, 181, 189, 0.8)",
      accent: "#166534", // Darker green for light theme borders
    },
    shadow: {
      sm: "rgba(0, 0, 0, 0.1)",
      md: "rgba(0, 0, 0, 0.15)",
      lg: "rgba(0, 0, 0, 0.2)",
    },
    primary: {
      default: "#16a34a", // Darker green for light theme primary
    },
  },
  dark: {
    background: {
      primary: "#000000",
      card: "#1a1a1a",
      hover: "#2a2a2a",
      active: "#3a3a3a",
      body: "#000000",
      code: "#1a1a1a",
      muted: "#2a2a2a",
      subtle: "#333333",
      highlight: "rgba(255, 235, 59, 0.2)",
      accent: "#34d399", // Softer green for dark theme - better visibility
    },
    text: {
      primary: "#ffffff",
      secondary: "#d1d5db",
      muted: "#9ca3af",
      accent: "#f3f4f6",
      code: "#ffffff",
      danger: "#ef4444",
      inverse: "#000000",
    },
    border: {
      default: "#374151",
      secondary: "#4b5563",
      focus: "#6b7280",
      hover: "#4b5563",
      accent: "#22c55e", // Softer green for dark theme borders
    },
    shadow: {
      sm: "rgba(0, 0, 0, 0.3)",
      md: "rgba(0, 0, 0, 0.4)",
      lg: "rgba(0, 0, 0, 0.5)",
    },
    primary: {
      default: "#22c55e", // Softer green for dark theme primary
    },
  },
  // Updated dark theme backgrounds - no purple
  background: {
    primary: "linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)",
    card: "rgba(255, 255, 255, 0.05)",
    hover: "rgba(255, 255, 255, 0.1)",
    active: "rgba(255, 255, 255, 0.15)",
  },
  text: {
    primary: "#ffffff",
    secondary: "#e2e8f0",
    muted: "#a0aec0",
    accent: "#f7fafc",
    code: "#ffd700",
  },
  border: {
    default: "1px solid rgba(34, 197, 94, 0.3)",
    focus: "rgba(34, 197, 94, 0.6)",
    hover: "rgba(34, 197, 94, 0.4)",
  },
  shadow: {
    sm: "0 2px 8px rgba(34, 197, 94, 0.3)",
    md: "0 4px 15px rgba(0, 0, 0, 0.2)",
    lg: "0 8px 25px rgba(0, 0, 0, 0.4)",
  },
  status: {
    error: "rgba(239, 68, 68, 0.2)",
    success: "rgba(34, 197, 94, 0.2)",
    warning: "rgba(245, 158, 11, 0.2)",
    info: "rgba(59, 130, 246, 0.2)",
  }
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
};

export const borderRadius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  xxl: "22px",
  full: "9999px",
};

export const typography = {
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.6",
    loose: "1.7",
  },
};

// Common style patterns
export const commonStyles = {
  // Gradients
  gradientBackground: {
    bg: colors.background.primary,
  },
  
  gradientButton: {
    bg: "linear-gradient(135deg, #16a34a, #15803d)", // Better contrast gradient
    borderRadius: borderRadius.full,
    boxShadow: colors.shadow.sm,
  },

  // Scrollbars
  customScrollbar: {
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: colors.green[300],
      borderRadius: borderRadius.sm,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  },

  // Interactive states
  hoverEffect: {
    transition: "all 0.2s ease-in-out",
    _hover: {
      transform: "scale(1.02)",
      boxShadow: colors.shadow.md,
    },
  },

  focusEffect: {
    _focus: {
      outline: "none",
      boxShadow: `0 0 0 2px ${colors.border.focus}`,
    },
  },

  // Cards
  glassCard: {
    bg: colors.background.card,
    backdropFilter: "blur(10px)",
    borderRadius: borderRadius.lg,
    border: colors.border.default,
    boxShadow: colors.shadow.sm,
  },

  // Buttons
  primaryButton: {
    bg: colors.green.dark, // Use darker green for better contrast
    color: colors.text.primary,
    borderRadius: borderRadius.lg,
    fontWeight: typography.fontWeight.semibold,
    transition: "all 0.2s",
    _hover: {
      bg: colors.green.darker, // Even darker on hover for light theme
      transform: "scale(1.05)",
    },
    _active: {
      transform: "scale(0.95)",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.6,
    },
  },

  ghostButton: {
    bg: "transparent",
    color: colors.text.secondary,
    borderRadius: borderRadius.md,
    transition: "all 0.2s",
    _hover: {
      bg: colors.background.hover,
      color: colors.text.primary,
    },
  },

  // Form elements
  input: {
    bg: "transparent",
    border: colors.border.default,
    borderRadius: borderRadius.md,
    color: colors.text.primary,
    _placeholder: {
      color: colors.text.muted,
    },
    _focus: {
      borderColor: colors.border.focus,
      boxShadow: `0 0 0 1px ${colors.border.focus}`,
    },
  },

  // Layout
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flexBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Text styles
  heading: {
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },

  bodyText: {
    color: colors.text.accent,
    lineHeight: typography.lineHeight.relaxed,
  },

  mutedText: {
    color: colors.text.muted,
    fontSize: typography.fontSize.sm,
  },

  // Markdown specific styles
  markdownContainer: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.loose,
    fontFamily: "system-ui, -apple-system, sans-serif",
    "& p": {
      marginBottom: spacing.lg,
    },
    "& code:not(pre code)": {
      background: colors.emerald[100],
      color: colors.text.code,
      padding: "2px 6px",
      borderRadius: borderRadius.sm,
    },
  },

  // Animation
  fadeIn: {
    animation: "fadeIn 0.3s ease-in-out",
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },

  slideIn: {
    animation: "slideIn 0.2s ease-out",
    "@keyframes slideIn": {
      "0%": { transform: "translateX(-10px)", opacity: 0 },
      "100%": { transform: "translateX(0)", opacity: 1 },
    },
  },
};

// Component-specific style variants
export const componentStyles = {
  // Chat message styles
  userMessage: {
    bg: "gray.700",
    px: spacing.lg,
    py: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.relaxed,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxW: "80%",
  },

  assistantMessage: {
    ...commonStyles.markdownContainer,
    maxW: "85%",
    minW: "200px",
  },

  // Sidebar styles
  sidebarContainer: {
    ...commonStyles.gradientBackground,
    ...commonStyles.customScrollbar,
    width: "300px",
    height: "100vh",
    overflowY: "auto",
    borderRight: colors.border.default,
  },

  sessionItem: {
    ...commonStyles.glassCard,
    p: spacing.md,
    mb: spacing.sm,
    cursor: "pointer",
    transition: "all 0.2s",
    _hover: {
      bg: colors.background.hover,
      transform: "translateX(4px)",
    },
  },

  // Input container
  inputContainer: {
    bg: "white",
    borderRadius: borderRadius.xl,
    px: spacing.lg,
    py: spacing.md,
    gap: spacing.md,
    alignItems: "flex-end",
    boxShadow: colors.shadow.sm,
    _focusWithin: {
      borderColor: "blue.400",
      boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
    },
    transition: "all 0.2s",
  },

  // File item
  fileItem: {
    ...commonStyles.glassCard,
    p: spacing.md,
    mb: spacing.sm,
    cursor: "pointer",
    _hover: {
      bg: colors.emerald[300],
    },
  },

  // Modal/Dialog styles
  modalOverlay: {
    backdropFilter: "blur(4px)",
    bg: "rgba(0, 0, 0, 0.4)",
  },

  modalContent: {
    ...commonStyles.glassCard,
    bg: colors.background.primary,
    border: colors.border.default,
    ...commonStyles.customScrollbar,
  },
};

// Utility functions for dynamic styles
export const getHoverStyle = (baseColor: string, opacity = 0.2) => ({
  _hover: {
    bg: `${baseColor}.${Math.floor(opacity * 10)}`,
  },
});

export const getFocusStyle = (borderColor = colors.border.focus) => ({
  _focus: {
    outline: "none",
    borderColor,
    boxShadow: `0 0 0 1px ${borderColor}`,
  },
});

export const getButtonVariant = (variant: 'primary' | 'ghost' | 'danger') => {
  switch (variant) {
    case 'primary':
      return commonStyles.primaryButton;
    case 'ghost':
      return commonStyles.ghostButton;
    case 'danger':
      return {
        ...commonStyles.primaryButton,
        bg: "red.500",
        _hover: {
          bg: "red.600",
        },
      };
    default:
      return commonStyles.primaryButton;
  }
};
