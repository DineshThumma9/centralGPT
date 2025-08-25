import {Button, ButtonGroup, Separator} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import useTheme from "../hooks/useTheme.ts";
import { useColorMode } from "../contexts/ColorModeContext";

interface Props {
    login_register: string,
    message: string
    isLoading: boolean
    onSubmit: () => void
    altlink: string
}

const NavGateButton = ({login_register, message, isLoading, onSubmit, altlink}: Props) => {
    const { themeColors } = useTheme();
    const { colorMode } = useColorMode();

    const buttonGroup = {
        alignSelf: "start",
        alignContent: "center",
        flexDirection: "column" as const,
        alignItems: "stretch",
        gap: 4,
        width: "100%",
    }

    const submitButtonStyles = {
        bg: themeColors.green.dark, // Use darker green for better contrast
        color: "white",
        border: "2px solid", // Thicker border for better definition
        borderColor: colorMode === 'light' ? "rgba(255, 255, 255, 0.3)" : themeColors.border.default,
        _hover: {
            bg: themeColors.green.darker, // Even darker on hover
            transform: "scale(1.02)",
            boxShadow: colorMode === 'light' ? 
                `0 12px 40px rgba(21, 128, 61, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.5)` :
                `0 8px 25px ${themeColors.shadow.sm}`
        },
        _active: {
            transform: "scale(0.98)",
        },
        transition: "all 0.2s",
        boxShadow: colorMode === 'light' ? 
            `0 8px 25px rgba(21, 128, 61, 0.3)` :
            `0 4px 16px ${themeColors.shadow.md}`,
        fontWeight: "bold",
        py: 3,
        borderRadius: "lg"
    }

    const outlineButtonStyles = {
        bg: colorMode === 'light' ? "rgba(255, 255, 255, 0.8)" : "transparent",
        color: themeColors.text.primary,
        border: "2px solid", // Thicker border for better definition
        borderColor: colorMode === 'light' ? "rgba(29, 78, 216, 0.3)" : themeColors.border.default,
        _hover: {
            bg: colorMode === 'light' ? "rgba(255, 255, 255, 0.9)" : themeColors.background.hover,
            borderColor: colorMode === 'light' ? "rgba(29, 78, 216, 0.5)" : themeColors.border.focus,
            transform: "scale(1.02)",
            boxShadow: colorMode === 'light' ? 
                `0 8px 25px rgba(0, 0, 0, 0.1)` : undefined,
        },
        _active: {
            transform: "scale(0.98)",
        },
        transition: "all 0.2s",
        fontWeight: colorMode === 'light' ? "600" : "medium", // Bolder text in light mode
        py: 3,
        borderRadius: "lg",
        width: "100%"
    }

    return (
        <ButtonGroup {...buttonGroup}>
            <Button
                onClick={() => onSubmit()}
                loading={isLoading}
                {...submitButtonStyles}
            >
                {login_register}
            </Button>

            <Separator
                borderColor={themeColors.border.default}
                my={2}
            />

            <Link to={altlink} style={{width: "100%"}}>
                <Button {...outlineButtonStyles}>
                    {message}
                </Button>
            </Link>
        </ButtonGroup>
    )
}

export default NavGateButton