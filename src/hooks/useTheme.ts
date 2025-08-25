// src/hooks/useTheme.ts
import { 
  colors, 
  spacing, 
  borderRadius, 
  typography, 
  commonStyles, 
  componentStyles,
  getHoverStyle,
  getFocusStyle,
  getButtonVariant
} from "../theme/styleDefinitions";

/**
 * Custom hook to access centralized theme styles
 * This provides a clean API to access all theme-related styles
 */
export const useAppTheme = () => {
  return {
    // Theme tokens
    colors,
    spacing,
    borderRadius,
    typography,
    
    // Style patterns
    common: commonStyles,
    components: componentStyles,
    
    // Utility functions
    getHoverStyle,
    getFocusStyle,
    getButtonVariant,
    
    // Convenience getters
    gradients: {
      primary: colors.background.primary,
      button: "linear-gradient(135deg, #16a34a, #15803d)", // Better contrast button gradient
    },
    
    shadows: {
      sm: colors.shadow.sm,
      md: colors.shadow.md,
      lg: colors.shadow.lg,
    },
    
    // Commonly used style combinations
    styles: {
      // Input container styles
      inputContainer: {
        ...componentStyles.inputContainer,
        ...commonStyles.customScrollbar,
      },
      
      // Message container styles
      messageContainer: {
        ...commonStyles.customScrollbar,
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        p: spacing.lg,
      },
      
      // Sidebar styles
      sidebar: {
        ...componentStyles.sidebarContainer,
        ...commonStyles.fadeIn,
      },
      
      // Modal styles
      modal: {
        overlay: componentStyles.modalOverlay,
        content: {
          ...componentStyles.modalContent,
          ...commonStyles.fadeIn,
        },
      },
      
      // Card styles
      card: {
        ...commonStyles.glassCard,
        ...commonStyles.hoverEffect,
      },
      
      // Button styles
      buttons: {
        primary: commonStyles.primaryButton,
        ghost: commonStyles.ghostButton,
        danger: getButtonVariant("danger"),
      },
    },
  };
};

// Default export for useTheme hook (compatible with existing usage)
const useTheme = () => {
  const theme = useAppTheme();
  return {
    themeColors: theme.colors,
    ...theme
  };
};

export default useTheme;

// Type for the theme object
export type AppTheme = ReturnType<typeof useAppTheme>;

// Export individual style objects for direct import
export {
  colors,
  spacing,
  borderRadius,
  typography,
  commonStyles,
  componentStyles,
  getHoverStyle,
  getFocusStyle,
  getButtonVariant,
};
