// Minimal styleDefinitions.ts for backward compatibility
// Most components have migrated to Chakra UI v3 semantic tokens
// This file provides fallback exports for remaining legacy components

export const colors = {
  green: {
    50: "rgba(34, 197, 94, 0.05)",
    100: "rgba(34, 197, 94, 0.1)",
    200: "rgba(34, 197, 94, 0.2)",
    300: "rgba(34, 197, 94, 0.3)",
    400: "rgba(34, 197, 94, 0.4)",
    500: "rgba(34, 197, 94, 0.5)",
    solid: "#22c55e",
    light: "#16a34a",
    dark: "#15803d",
  },
  emerald: {
    50: "rgba(16, 185, 129, 0.05)",
    100: "rgba(16, 185, 129, 0.1)",
    200: "rgba(16, 185, 129, 0.2)",
    300: "rgba(16, 185, 129, 0.3)",
    400: "rgba(16, 185, 129, 0.4)",
    500: "#10b981",
    solid: "#059669",
  }
};

export const spacing = {
  xs: "4px",
  sm: "8px", 
  md: "16px",
  lg: "24px",
  xl: "32px",
};

export const borderRadius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
};

export const typography = {
  fontFamily: {
    heading: "'Red Rose', sans-serif",
    body: "'Jaldi', sans-serif",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    bold: "600",
    semibold: "700",
  }
};

export const commonStyles = {
  borderRadius: borderRadius.md,
  padding: spacing.md,
};

export const componentStyles = {
  assistantMessage: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: "bg.panel",
  }
};

export const getButtonVariant = (variant: string) => ({
  backgroundColor: colors.green.solid,
  color: "white",
  padding: `${spacing.sm} ${spacing.md}`,
  borderRadius: borderRadius.md,
});

export const getHoverStyle = () => ({
  opacity: 0.8,
});

export const getFocusStyle = () => ({
  outline: `2px solid ${colors.green.solid}`,
});
