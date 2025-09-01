# Theme-Based Component Styling Guide

## Overview

Instead of manually setting colors for each component, we now use Chakra UI v3's semantic token system and component recipes. This approach provides:

1. **Automatic theme adaptation** - Components automatically adjust to light/dark mode
2. **Consistency** - All components use the same design tokens
3. **Maintainability** - Colors are defined once in the theme config
4. **Performance** - Less inline styling, better CSS optimization

## Key Concepts

### 1. Semantic Tokens
Semantic tokens automatically adapt to different themes:

```typescript
// ✅ GOOD: Semantic tokens (automatically adapts)
bg: "bg.surface"        // Background for cards, panels
bg: "bg.canvas"         // Main background
color: "fg.default"     // Default text color
borderColor: "border.default" // Default border color

// ❌ BAD: Manual color values
bg: themeColors.background.card
color: colors.text.primary
```

### 2. Component Recipes
Define component styles once in the theme, use everywhere:

```typescript
// Define once in theme/componentRecipes.ts
export const userRequestRecipe = defineRecipe({
  className: "user-request",
  base: {
    bg: "fg.default",
    color: "bg.canvas",
    px: "4",
    py: "1",
    borderRadius: "xl",
    // ... other styles
  },
  variants: {
    size: {
      sm: { px: "3", fontSize: "sm" },
      md: { px: "4", fontSize: "md" },
      lg: { px: "5", fontSize: "lg" },
    }
  }
});

// Use in component
<Box css={{ userRequest: {} }}>
  Content
</Box>
```

## Migration Examples

### Before (Manual Styling)
```tsx
const UserRequest = ({ msg }) => {
  const boxStyles = {
    bg: themeColors.text.primary,
    color: themeColors.background.primary,
    px: 4,
    py: 1,
    borderRadius: "xl",
    boxShadow: \`0 2px 12px \${themeColors.background.hover}\`,
    borderColor: themeColors.border.default
  };

  return <Box {...boxStyles}>{msg.content}</Box>;
};
```

### After (Recipe-Based)
```tsx
const UserRequest = ({ msg }) => {
  return <Box css={{ userRequest: {} }}>{msg.content}</Box>;
};
```

### Benefits Comparison

| Aspect | Manual Styling | Recipe-Based |
|--------|---------------|--------------|
| Theme adaptation | Manual updates needed | Automatic |
| Code maintenance | High (scattered styles) | Low (centralized) |
| Consistency | Prone to drift | Guaranteed |
| Performance | Inline styles | Optimized CSS |
| Bundle size | Larger | Smaller |

## Available Semantic Tokens

### Background Tokens
- \`bg.canvas\` - Main background
- \`bg.surface\` - Cards, panels
- \`bg.subtle\` - Hover states
- \`bg.muted\` - Disabled/muted elements
- \`bg.emphasized\` - Active/selected states

### Text Tokens
- \`fg.default\` - Primary text
- \`fg.subtle\` - Secondary text
- \`fg.muted\` - Disabled/muted text
- \`fg.inverted\` - Text on dark backgrounds

### Border Tokens
- \`border.default\` - Standard borders
- \`border.subtle\` - Light borders
- \`border.accent\` - Focus/active borders

### Brand Tokens
- \`brand.solid\` - Primary brand color
- \`brand.hover\` - Hover state
- \`brand.active\` - Active state
- \`brand.fg\` - Text on brand background

## Implementation Strategy

1. **Create recipes** for common component patterns
2. **Use semantic tokens** for one-off styling
3. **Avoid manual color values** completely
4. **Test in both themes** to ensure proper adaptation

## Example Component Recipes

```typescript
// Button variations
const buttonRecipe = defineRecipe({
  base: {
    transition: "all 0.2s",
    borderRadius: "lg",
  },
  variants: {
    variant: {
      primary: {
        bg: "brand.solid",
        color: "brand.fg",
        _hover: { bg: "brand.hover" }
      },
      ghost: {
        bg: "transparent",
        color: "fg.default",
        _hover: { bg: "bg.subtle" }
      }
    }
  }
});

// Card variations
const cardRecipe = defineRecipe({
  base: {
    bg: "bg.surface",
    borderRadius: "lg",
    border: "1px solid",
    borderColor: "border.default",
  },
  variants: {
    variant: {
      default: {},
      elevated: { boxShadow: "lg" },
      outlined: { borderColor: "border.accent" }
    }
  }
});
```

This approach ensures your application looks consistent and adapts properly to theme changes without manual intervention.
