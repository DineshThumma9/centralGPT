import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "dark"
};

const theme = extendTheme({
    config,
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
            50:  '#e6f9f0',
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
        black: {
            50:  '#e5e5e5',
            100: '#b8b8b8',
            200: '#8a8a8a',
            300: '#5c5c5c',
            400: '#2e2e2e',
            500: '#000000',
            600: '#000000',
            700: '#000000',
            800: '#000000',
            900: '#000000'
        }
    }
});

export default theme;