"use client";

import {Box, HStack, IconButton} from "@chakra-ui/react";
import {X} from "lucide-react";
import { useColorMode } from "../contexts/ColorModeContext";

interface FileItemProps {
    files: File[];
    onRemove: (index: number) => void;
    isUserMessage?: boolean;
}

const FileUploadList = ({files, onRemove, isUserMessage = false}: FileItemProps) => {
    const { colors } = useColorMode();
    
    if (files.length === 0) return null;

    return (
        <HStack overflowX="auto" gap={2} pb={2} justifyContent={"flex-start"} color={colors.text.primary}>
            {files.map((file, index) => (
                <Box
                    key={`${file.name}-${index}`}
                    minW="240px"
                    maxW="240px"
                    h="50px"
                    bg={colors.background.accent}
                    border={`1px solid ${colors.border.accent}`}
                    borderRadius="12px"
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    position="relative"
                >
                    <HStack gap={3} flex={1} overflow="hidden">
                        <Box fontSize="24px" color={colors.text.primary}>
                            📄
                        </Box>
                        <Box fontSize="sm" fontWeight="500" color={colors.text.primary} truncate>
                            {file.name}
                        </Box>
                    </HStack>
                    {!isUserMessage && (
                        <IconButton
                            size="xs"
                            variant="ghost"
                            onClick={() => onRemove(index)}
                            aria-label="Remove file"
                            color={colors.text.primary}
                            _hover={{bg: colors.background.hover}}
                        >
                            <X size={14}/>
                        </IconButton>
                    )}
                </Box>
            ))}
        </HStack>
    );
};


export {FileUploadList};