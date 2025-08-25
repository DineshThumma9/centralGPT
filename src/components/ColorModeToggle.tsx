// src/components/ColorModeToggle.tsx
import { IconButton } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useColorMode } from "../contexts/ColorModeContext";

export const ColorModeToggle = () => {
  const { colorMode, toggleColorMode, colors } = useColorMode();

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      onClick={toggleColorMode}
      size="md"
      variant="ghost"
      color={colors.text.secondary}
      _hover={{
        bg: colors.background.hover,
        color: colors.text.primary
      }}
      transition="all 0.2s ease"
    >
      {colorMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </IconButton>
  );
};
