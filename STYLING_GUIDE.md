# Centralized Styling System

This document explains how to use the centralized styling system to replace inline CSS and scattered styles throughout the application.

## Overview

The centralized styling system consists of:

1. **Style Definitions** (`src/theme/styleDefinitions.ts`) - Core style constants and patterns
2. **Component Recipes** (`src/theme/componentRecipes.ts`) - Reusable component style variants
3. **Theme Integration** (`src/theme.ts`) - Integration with Chakra UI theme
4. **Style Helpers** (`src/utils/styleHelpers.ts`) - Utility functions for migration
5. **Custom Hook** (`src/hooks/useTheme.ts`) - Easy access to theme styles

## Migration Guide

### Before (Inline Styles)
```tsx
// ❌ Don't do this
<Box
  bg="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"
  css={{
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(139, 92, 246, 0.3)",
    },
  }}
  _hover={{ bg: "rgba(139, 92, 246, 0.2)" }}
>
```

### After (Centralized Styles)
```tsx
// ✅ Do this instead
import { useAppTheme } from '../hooks/useTheme';

const { styles } = useAppTheme();

<Box sx={styles.card}>
```

Or using direct imports:
```tsx
// ✅ Or this
import { commonStyles } from '../theme/styleDefinitions';

<Box sx={combineStyles(commonStyles.gradientBackground, commonStyles.customScrollbar)}>
```

## Usage Examples

### 1. Using the Custom Hook

```tsx
import { useAppTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const theme = useAppTheme();
  
  return (
    <Box sx={theme.styles.card}>
      <Button sx={theme.styles.buttons.primary}>
        Primary Button
      </Button>
      <Button sx={theme.styles.buttons.ghost}>
        Ghost Button
      </Button>
    </Box>
  );
};
```

### 2. Using Direct Style Imports

```tsx
import { commonStyles, componentStyles } from '../theme/styleDefinitions';

const ChatMessage = ({ isUser }) => (
  <Box sx={isUser ? componentStyles.userMessage : componentStyles.assistantMessage}>
    {/* Message content */}
  </Box>
);
```

### 3. Using Component Recipes

```tsx
import { Box } from '@chakra-ui/react';

// Using recipe classes (defined in theme)
<Box className="chat-message" data-type="user">
  User message
</Box>

<Box className="chat-message" data-type="assistant">
  Assistant message
</Box>
```

### 4. Using Style Helpers

```tsx
import { getThemeStyle, combineStyles } from '../utils/styleHelpers';

const MyComponent = () => (
  <Box sx={combineStyles(
    getThemeStyle('card'),
    getThemeStyle('scrollbar')
  )}>
    {/* Content */}
  </Box>
);
```

## Available Style Categories

### Colors
```tsx
import { colors } from '../theme/styleDefinitions';

// Usage
color={colors.text.primary}      // white
color={colors.text.secondary}    // purple.200
color={colors.text.accent}       // purple.50
bg={colors.violet[100]}          // rgba(139, 92, 246, 0.1)
```

### Spacing & Layout
```tsx
import { spacing, borderRadius } from '../theme/styleDefinitions';

// Usage
p={spacing.lg}                   // 24px
borderRadius={borderRadius.xl}   // 16px
```

### Common Patterns
```tsx
import { commonStyles } from '../theme/styleDefinitions';

// Available patterns:
commonStyles.gradientBackground  // App background gradient
commonStyles.glassCard          // Glass morphism card
commonStyles.customScrollbar    // Styled scrollbars
commonStyles.primaryButton      // Primary button styles
commonStyles.ghostButton        // Ghost button styles
commonStyles.hoverEffect        // Hover animations
commonStyles.focusEffect        // Focus states
commonStyles.fadeIn            // Fade in animation
commonStyles.flexCenter        // Flex center layout
```

### Component Styles
```tsx
import { componentStyles } from '../theme/styleDefinitions';

// Available components:
componentStyles.userMessage        // User chat message
componentStyles.assistantMessage   // AI chat message
componentStyles.sidebarContainer   // Sidebar layout
componentStyles.sessionItem        // Session list item
componentStyles.inputContainer     // Input wrapper
componentStyles.fileItem          // File list item
componentStyles.modalOverlay       // Modal backdrop
componentStyles.modalContent       // Modal content
```

## Migration Checklist

### 1. Replace Background Gradients
- [ ] Replace `bg="linear-gradient(...)"` with `sx={commonStyles.gradientBackground}`

### 2. Replace Scrollbar Styles
- [ ] Replace inline scrollbar CSS with `sx={commonStyles.customScrollbar}`

### 3. Replace Hover Effects
- [ ] Replace `_hover={{bg: "rgba(...)"}}` with `sx={getHoverStyle('violet', 0.2)}`

### 4. Replace Button Styles
- [ ] Use `sx={commonStyles.primaryButton}` or `sx={commonStyles.ghostButton}`

### 5. Replace Card Styles
- [ ] Use `sx={commonStyles.glassCard}` for glass morphism effects

### 6. Replace Color Values
- [ ] Replace hardcoded rgba values with `colors.violet[100]`, etc.

### 7. Replace Spacing Values
- [ ] Replace hardcoded px values with `spacing.lg`, etc.

## Component-Specific Examples

### Chat Messages
```tsx
// Before
<Box
  bg="gray.700"
  px={4}
  py={3}
  borderRadius="lg"
  color="white"
  maxW="80%"
>

// After
<Box sx={componentStyles.userMessage}>
```

### Sidebar
```tsx
// Before
<Box
  bg="linear-gradient(...)"
  width="300px"
  height="100vh"
  css={{ "&::-webkit-scrollbar": { ... } }}
>

// After
<Box sx={componentStyles.sidebarContainer}>
```

### Buttons
```tsx
// Before
<Button
  bg="purple.500"
  color="white"
  _hover={{ bg: "purple.600" }}
  borderRadius="lg"
>

// After
<Button sx={commonStyles.primaryButton}>
```

## Best Practices

1. **Always prefer centralized styles** over inline styles
2. **Use the custom hook** for complex components that need multiple style patterns
3. **Import specific styles** for simple components
4. **Combine styles** using `combineStyles()` helper when needed
5. **Add new patterns** to `styleDefinitions.ts` instead of creating inline styles
6. **Use component recipes** for consistent variants across the app

## Adding New Styles

When you need a new style pattern:

1. Add it to `styleDefinitions.ts` in the appropriate category
2. If it's component-specific, add it to `componentStyles`
3. If it's a common pattern, add it to `commonStyles`
4. Create a recipe in `componentRecipes.ts` if it needs variants
5. Update this documentation

## Development Tools

Use the development warning system:
```tsx
import { warnDeprecatedStyles } from '../utils/styleHelpers';

// This will warn about inline styles in development
warnDeprecatedStyles('MyComponent', { css: {}, _hover: {} });
```

This system helps maintain consistent styling across the application while making it easier to update themes and maintain the codebase.
