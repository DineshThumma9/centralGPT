import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false
};

const theme = extendTheme({
    config,
    fonts: {
        heading: "'Red Rose', sans-serif",
        body: "'Jaldi', sans-serif",
    },
    colors: {
        gray: {
            50: '#f9f9f9',
            100: '#ededed',
            200: '#d3d3d3',
            300: '#b3b3b3',
            400: '#a0a0a0',
            500: '#898989',
            600: '#6c6c6c',
            700: '#202020',
            800: '#121212',
            900: '#111111'
        },
        green: {
            50: '#e6f9f0',
            100: '#b2f2d9',
            200: '#7debc2',
            300: '#48e4ab',
            400: '#24d68f',
            500: '#12b36f',
            600: '#0e8a54',
            700: '#09613a',
            800: '#053820',
            900: '#021107'
        },
        brand: {
            50: '#e6f9f0',
            100: '#b2f2d9',
            200: '#7debc2',
            300: '#48e4ab',
            400: '#24d68f',
            500: '#12b36f', // Primary green
            600: '#0e8a54',
            700: '#09613a',
            800: '#053820',
            900: '#021107'
        },
        surface: {
            primary: '#000000',    // Main black background
            secondary: '#121212',  // Card/component backgrounds
            tertiary: '#202020',   // Elevated surfaces
            sidebar: '#1a1a1a',    // Sidebar background
        },
        text: {
            primary: '#ffffff',    // Primary text (white)
            secondary: '#b3b3b3',  // Secondary text (gray)
            muted: '#898989',      // Muted text
        }
    },
    semanticTokens: {
        colors: {
            // App-wide color tokens
            'app.bg': 'surface.primary',
            'app.sidebar.bg': 'surface.sidebar',
            'app.card.bg': 'surface.secondary',
            'app.text.primary': 'text.primary',
            'app.text.secondary': 'text.secondary',
            'app.accent': 'brand.500',
            'app.border': 'gray.600',
        }
    },
    styles: {
        global: {
            body: {
                bg: 'app.bg',
                color: 'app.text.primary',
                fontFamily: 'body',
            },
            '*': {
                borderColor: 'app.border !important',
            }
        },
    },
    components: {
        // Override component defaults
        Button: {
            defaultProps: {
                colorScheme: 'brand',
            },
        },
        Input: {
            defaultProps: {
                focusBorderColor: 'brand.500',
            },
        },
        Menu: {
            baseStyle: {
                list: {
                    bg: 'app.card.bg',
                    borderColor: 'app.border',
                },
                item: {
                    bg: 'app.card.bg',
                    color: 'app.text.primary',
                    _hover: {
                        bg: 'surface.tertiary',
                    }
                }
            }
        }
    }
});

export default theme;