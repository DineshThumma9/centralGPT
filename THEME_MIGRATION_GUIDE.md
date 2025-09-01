# Theme Migration Guide - Custom to Chakra UI v3

This guide shows how to migrate from our custom `ColorModeContext` to Chakra UI v3's built-in color mode system.

## ✅ What's Changed

### 1. **ColorModeProvider**
```tsx
// ❌ OLD - Custom Context
import { ColorModeProvider } from "../contexts/ColorModeContext.tsx";

// ✅ NEW - Chakra UI v3 Built-in
import { ColorModeProvider } from "../components/ui/color-mode.tsx";
```

### 2. **useColorMode Hook**
```tsx
// ❌ OLD - Custom Hook
import { useColorMode } from "../contexts/ColorModeContext";
const { colorMode, toggleColorMode, colors } = useColorMode();

// ✅ NEW - Chakra UI v3 Hook
import { useColorMode } from "../components/ui/color-mode";
const { colorMode, toggleColorMode } = useColorMode();
// No more manual color objects!
```

### 3. **Styling Approach**
```tsx
// ❌ OLD - Manual color objects
const styles = {
  bg: colorMode === 'light' ? colors.light.background.card : colors.dark.background.card,
  color: colorMode === 'light' ? colors.light.text.primary : colors.dark.text.primary,
};

// ✅ NEW - Semantic tokens (automatic light/dark)
const styles = {
  bg: "bg.surface",      // Automatically handles light/dark
  color: "fg.default",   // Automatically handles light/dark
};
```

## 🎨 New Semantic Tokens

### Background Colors
- `bg.canvas` - Main app background
- `bg.surface` - Card/component backgrounds
- `bg.subtle` - Subtle background variations
- `bg.muted` - Muted backgrounds

### Text Colors
- `fg.default` - Primary text
- `fg.muted` - Secondary text
- `fg.subtle` - Subtle text

### Brand Colors
- `brand.solid` - Primary brand color
- `brand.subtle` - Subtle brand backgrounds
- `brand.emphasized` - Emphasized brand elements

### Border Colors
- `border.default` - Standard borders
- `border.emphasized` - Prominent borders
- `border.accent` - Brand colored borders

## 📝 Component Migration Examples

### Button Migration
```tsx
// ❌ OLD
<Button
  bg={colorMode === 'light' ? colors.light.primary.default : colors.dark.primary.default}
  color={colorMode === 'light' ? "white" : "black"}
  _hover={{
    bg: colorMode === 'light' ? colors.light.background.hover : colors.dark.background.hover
  }}
>
  Click me
</Button>

// ✅ NEW
<Button
  colorPalette="brand"
  variant="solid"
>
  Click me
</Button>
```

### Card Migration
```tsx
// ❌ OLD
<Box
  bg={colorMode === 'light' ? colors.light.background.card : colors.dark.background.card}
  borderColor={colorMode === 'light' ? colors.light.border.default : colors.dark.border.default}
  color={colorMode === 'light' ? colors.light.text.primary : colors.dark.text.primary}
>
  Content
</Box>

// ✅ NEW
<Box
  bg="bg.surface"
  borderColor="border.default"
  color="fg.default"
>
  Content
</Box>
```

### Input Migration
```tsx
// ❌ OLD
<Input
  bg={colorMode === 'light' ? "rgba(255, 255, 255, 0.98)" : colors.background.card}
  color={colorMode === 'light' ? "#000" : colors.text.primary}
  borderColor={colorMode === 'light' ? "#ddd" : colors.border.default}
/>

// ✅ NEW
<Input
  bg="bg.surface"
  color="fg.default"
  borderColor="border.default"
/>
```

## 🚀 Benefits of Migration

1. **Automatic Color Mode** - No more manual `colorMode === 'light'` checks
2. **Consistent Design** - Semantic tokens ensure consistency
3. **Better Performance** - No runtime color calculations
4. **Future Proof** - Uses Chakra UI v3 standards
5. **Less Code** - Semantic tokens reduce boilerplate

## 🔄 Step-by-Step Migration

1. **Update imports** - Change from custom context to `ui/color-mode`
2. **Remove color objects** - Replace `colors.light.xxx` with semantic tokens
3. **Use semantic tokens** - Replace conditional colors with semantic tokens
4. **Add colorPalette** - Use `colorPalette="brand"` for brand colors
5. **Test components** - Verify light/dark mode switching works
6. **Remove custom context** - Delete `ColorModeContext.tsx` when done

## 📋 Quick Reference

| Old Custom Approach | New Semantic Token |
|---------------------|-------------------|
| `colors.light.background.body` | `bg.canvas` |
| `colors.dark.background.card` | `bg.surface` |
| `colors.light.text.primary` | `fg.default` |
| `colors.dark.text.muted` | `fg.muted` |
| `colors.light.border.default` | `border.default` |
| `colors.green.solid` | `brand.solid` |

This migration will make your codebase more maintainable and aligned with Chakra UI v3 best practices!
