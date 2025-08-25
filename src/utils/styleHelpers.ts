// src/utils/styleHelpers.ts
// Utility functions to help migrate from inline styles to centralized styles

import { 
  borderRadius, 
  commonStyles, 
  componentStyles 
} from "../theme/styleDefinitions";

/**
 * Replace common inline style patterns with centralized equivalents
 */
export const styleReplacements = {
  // Background colors
  "bg=\"linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%)\"": "sx={commonStyles.gradientBackground}",
  "bg=\"rgba(34, 197, 94, 0.1)\"": "bg=\"green.100\"",
  "bg=\"rgba(34, 197, 94, 0.2)\"": "bg=\"green.200\"",
  "bg=\"rgba(34, 197, 94, 0.3)\"": "bg=\"green.300\"",
  
  // Colors
  "color=\"green.200\"": "color=\"green.200\"",
  "color=\"green.50\"": "color=\"green.50\"",
  "color=\"white\"": "color=\"white\"",
  
  // Border radius
  "borderRadius=\"xl\"": `borderRadius="${borderRadius.xl}"`,
  "borderRadius=\"lg\"": `borderRadius="${borderRadius.lg}"`,
  "borderRadius=\"md\"": `borderRadius="${borderRadius.md}"`,
  "borderRadius=\"full\"": `borderRadius="${borderRadius.full}"`,
  
  // Common style patterns
  "css={{\"&::-webkit-scrollbar\"": "sx={commonStyles.customScrollbar}",
  "_hover={{bg: \"rgba(34, 197, 94, 0.2)\"}": "sx={getHoverStyle('green', 0.2)}",
  "_hover={{bg: \"rgba(34, 197, 94, 0.3)\"}": "sx={getHoverStyle('green', 0.3)}",
};

/**
 * Convert inline CSS objects to use centralized styles
 */
export const convertInlineStyles = {
  // Scrollbar styles
  scrollbar: () => commonStyles.customScrollbar,
  
  // Gradient backgrounds
  gradientBg: () => commonStyles.gradientBackground,
  
  // Glass card effect
  glassCard: () => commonStyles.glassCard,
  
  // Hover effects
  hoverEffect: (color = 'green', opacity = 0.2) => ({
    _hover: {
      bg: `${color}.${Math.floor(opacity * 10)}`,
      transition: "all 0.2s",
    },
  }),
  
  // Focus effects
  focusEffect: () => commonStyles.focusEffect,
  
  // Button styles
  primaryButton: () => commonStyles.primaryButton,
  ghostButton: () => commonStyles.ghostButton,
  
  // Input styles
  inputBase: () => commonStyles.input,
};

/**
 * Common component style mappings
 */
export const componentStyleMappings = {
  // Message components
  userMessage: componentStyles.userMessage,
  assistantMessage: componentStyles.assistantMessage,
  
  // Sidebar components
  sidebarContainer: componentStyles.sidebarContainer,
  sessionItem: componentStyles.sessionItem,
  
  // Input components
  inputContainer: componentStyles.inputContainer,
  
  // File components
  fileItem: componentStyles.fileItem,
  
  // Modal components
  modalOverlay: componentStyles.modalOverlay,
  modalContent: componentStyles.modalContent,
};

/**
 * Helper function to combine multiple style objects
 */
export const combineStyles = (...styles: any[]) => {
  return Object.assign({}, ...styles);
};

/**
 * Helper function to create responsive styles
 */
export const createResponsiveStyle = (
  base: any,
  sm?: any,
  md?: any,
  lg?: any
) => {
  return {
    ...base,
    ...(sm && { "@media (min-width: 480px)": sm }),
    ...(md && { "@media (min-width: 768px)": md }),
    ...(lg && { "@media (min-width: 1024px)": lg }),
  };
};

/**
 * Migration helper - warns about deprecated inline styles
 */
export const warnDeprecatedStyles = (componentName: string, inlineStyles: any) => {
  if (process.env.NODE_ENV === 'development') {
    const deprecatedProps = Object.keys(inlineStyles).filter(prop => 
      ['css', 'style', '_hover', '_focus', '_active'].includes(prop)
    );
    
    if (deprecatedProps.length > 0) {
      console.warn(
        `${componentName}: Consider moving inline styles to centralized theme:`,
        deprecatedProps
      );
    }
  }
};

/**
 * Get theme-based style for common patterns
 */
export const getThemeStyle = (pattern: string, variant?: string) => {
  switch (pattern) {
    case 'button':
      return variant === 'ghost' ? commonStyles.ghostButton : commonStyles.primaryButton;
    case 'card':
      return commonStyles.glassCard;
    case 'input':
      return commonStyles.input;
    case 'scrollbar':
      return commonStyles.customScrollbar;
    case 'gradient':
      return commonStyles.gradientBackground;
    default:
      return {};
  }
};

