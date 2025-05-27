import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";


const tokens = {
  colors: {
    gray: {
      50: { value: '#f9f9f9' },
      100: { value: '#ededed' },
      200: { value: '#d3d3d3' },
      300: { value: '#b3b3b3' },
      400: { value: '#a0a0a0' },
      500: { value: '#898989' },
      600: { value: '#6c6c6c' },
      700: { value: '#202020' },
      800: { value: '#121212' },
      900: { value: '#111111' }
    },
    green: {
      50: { value: '#e6f9f0' },
      100: { value: '#b2f2d9' },
      200: { value: '#7debc2' },
      300: { value: '#48e4ab' },
      400: { value: '#24d68f' },
      500: { value: '#12b36f' },
      600: { value: '#0e8a54' },
      700: { value: '#09613a' },
      800: { value: '#053820' },
      900: { value: '#021107' }
    },
    brand: {
      50: { value: '#e6f9f0' },
      100: { value: '#b2f2d9' },
      200: { value: '#7debc2' },
      300: { value: '#48e4ab' },
      400: { value: '#24d68f' },
      500: { value: '#12b36f' },
      600: { value: '#0e8a54' },
      700: { value: '#09613a' },
      800: { value: '#053820' },
      900: { value: '#021107' }
    },
    surface: {
      primary: { value: '#000000' },
      secondary: { value: '#121212' },
      tertiary: { value: '#202020' },
      sidebar: { value: '#1a1a1a' },
    },
    text: {
      primary: { value: '#ffffff' },
      secondary: { value: '#b3b3b3' },
      muted: { value: '#898989' },
    }
  },
  fonts: {
    heading: { value: "'Red Rose', sans-serif" },
    body: { value: "'Jaldi', sans-serif" }
  }
};

// 2. Semantic tokens
const semanticTokens = {
  colors: {
    "app.bg": { value: "{colors.surface.primary}" },
    "app.sidebar.bg": { value: "{colors.surface.sidebar}" },
    "app.card.bg": { value: "{colors.surface.secondary}" },
    "app.text.primary": { value: "{colors.text.primary}" },
    "app.text.secondary": { value: "{colors.text.secondary}" },
    "app.accent": { value: "{colors.brand.500}" },
    "app.border": { value: "{colors.gray.600}" },
  }
};

// 3. Global CSS
const globalCss = {
  body: {
    bg: "{colors.surface.primary}",
    color: "{colors.text.primary}",
    fontFamily: "{fonts.body}",
  },
  "*": {
    borderColor: "{colors.gray.600} !important",
  }
};

// 4. Create config and system
const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
  },
  globalCss,
});

const system = createSystem(defaultConfig, config);


export const buttonRecipe = system.cva({
  base: {
    fontWeight: "bold",
    borderRadius: "md",
  },
  variants: {
    variant: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
        },
      },
      outline: {
        border: "2px solid",
        borderColor: "brand.500",
        color: "brand.500",
        _hover: {
          bg: "brand.50",
        },
      },
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

// Example: Input recipe
export const inputRecipe = system.cva({
  base: {
    borderRadius: "md",
    borderColor: "gray.600",
    _focus: {
      borderColor: "brand.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
    },
  },
});


export const menuRecipe = system.sva({
  slots: ["list", "item"],
  base: {
    list: {
      bg: "surface.secondary",
      borderColor: "gray.600",
    },
    item: {
      bg: "surface.secondary",
      color: "text.primary",
      _hover: {
        bg: "surface.tertiary",
      },
    },
  },

});


export default system;
