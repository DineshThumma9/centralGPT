# Light Mode Text Visibility Fixes

## Changes Made

### 1. Updated Light Mode Colors in styleDefinitions.ts
- **Background colors**: Changed to pure white (#ffffff) and near-white colors for better contrast
- **Text colors**: Made text colors much darker (#111827, #374151, #6b7280) for better visibility
- **Border colors**: Enhanced border visibility with darker, more opaque colors

### 2. Component Updates
Updated the following components to use semantic tokens instead of raw color values:

#### API-Key.tsx
- Dialog content, header, body backgrounds
- Input field colors and borders
- Button colors and hover states
- All text colors for better visibility

#### MenuHelper.tsx  
- Button styles for menu triggers
- Menu content backgrounds
- Menu item text colors
- Hover states

#### AvaterExpandable.tsx
- Avatar button styling
- Menu content and items
- Icon button colors
- All text references

#### EmptyState.tsx
- Bot icon color
- Heading and description text colors
- Background colors

#### ColorModeToggle.tsx
- Icon button colors and hover states

#### GitDialog.tsx
- Dialog body text color
- Input field styling and colors

### 3. Enhanced Semantic Tokens
Added/updated semantic tokens in theme.ts:
- `app.text` - Primary text color with proper light/dark mode support
- `app.text.secondary` - Secondary text with good contrast
- `app.text.muted` - Muted text that's still visible
- `app.bg.card` - Card backgrounds
- `app.bg.hover` - Hover state backgrounds
- `app.border.default` - Default border colors
- `app.border.hover` - Hover border colors
- `app.button.primary` - Primary button colors

## Benefits

1. **Improved Visibility**: Text is now clearly visible in light mode
2. **Better Contrast**: Enhanced contrast ratios for accessibility
3. **Consistent Theming**: All components use semantic tokens
4. **Maintainable**: Easy to update colors globally through semantic tokens
5. **Future-proof**: Works with both light and dark modes automatically

## Testing

To test the improvements:
1. Switch to light mode using the color mode toggle
2. Check dialog visibility (API Key dialog, Git dialog)
3. Verify menu text (Avatar menu, LLM provider menus)
4. Confirm all text is clearly readable

The changes ensure that all interactive elements and text are clearly visible in light mode while maintaining the existing dark mode appearance.
