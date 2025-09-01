"use client";

import {Box, HStack, IconButton} from "@chakra-ui/react";
import {X} from "lucide-react";


interface FileItemProps {
    files: File[];
    onRemove: (index: number) => void;
    isUserMessage?: boolean;
}

const FileUploadList = ({files, onRemove, isUserMessage = false}: FileItemProps) => {
    

    if (files.length === 0) return null;

    return (
        <HStack overflowX="auto" gap={2} pb={2} justifyContent={"flex-start"} color={"fg"}>
            {files.map((file, index) => (
                <Box
                    key={`${file.name}-${index}`}
                    minW="240px"
                    maxW="240px"
                    h="50px"
                    bg={{ base: "gray.50", _dark: "gray.800" }}
                    border="1px solid"
                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                    borderRadius="12px"
                    p={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    position="relative"
                    transition="all 0.2s ease"
                    _hover={{
                        borderColor: { base: "gray.300", _dark: "gray.600" },
                        bg: { base: "gray.100", _dark: "gray.700" }
                    }}
                >
                    <HStack gap={3} flex={1} overflow="hidden">
                        <Box fontSize="24px" color={{ base: "gray.600", _dark: "gray.400" }}>
                            📄
                        </Box>
                        <Box fontSize="sm" fontWeight="500" color={{ base: "gray.800", _dark: "gray.200" }} truncate>
                            {file.name}
                        </Box>
                    </HStack>
                    {!isUserMessage && (
                        <IconButton
                            size="xs"
                            variant="ghost"
                            onClick={() => onRemove(index)}
                            aria-label="Remove file"
                            color={{ base: "red.600", _dark: "red.400" }}
                            bg="transparent"
                            borderRadius="full"
                            minW="20px"
                            h="20px"
                            transition="all 0.2s ease"
                            _hover={{
                                bg: { base: "red.50", _dark: "red.950" },
                                color: { base: "red.700", _dark: "red.300" },
                                transform: "scale(1.2)"
                            }}
                            _active={{
                                transform: "scale(0.9)",
                                bg: { base: "red.100", _dark: "red.900" }
                            }}
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