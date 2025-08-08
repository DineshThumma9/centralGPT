import { Box, Checkbox, VStack, Text, HStack, Icon } from "@chakra-ui/react";
import type {FileType} from "./GitDialog.tsx";
import { useState } from "react";

interface Props {
    files: FileType[];
    selectedFiles: string[];
    setSelectedFiles: (paths: string[]) => void;
}

// Simple icons for file/folder representation
const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 9V3.5L18.5 9M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2H6Z"/>
    </svg>
);

const FolderIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V8C22 6.89 21.11 6 20 6H12L10 4Z"/>
    </svg>
);

const GitExplorer = ({ files, selectedFiles, setSelectedFiles }: Props) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    const handleSelect = (path: string, type: string) => {
        if (type === "tree") {
            // Handle folder selection - select/unselect all files in that folder
            const folderFiles = files.filter(file =>
                file.type === "blob" && file.path.startsWith(path + "/")
            );

            const folderFilePaths = folderFiles.map(file => file.path);
            const allSelected = folderFilePaths.every(filePath => selectedFiles.includes(filePath));

            if (allSelected) {
                // Unselect all files in folder
                setSelectedFiles(selectedFiles.filter(filePath => !folderFilePaths.includes(filePath)));
            } else {
                // Select all files in folder
                const newSelection = [...new Set([...selectedFiles, ...folderFilePaths])];
                setSelectedFiles(newSelection);
            }
        } else {
            // Handle individual file selection
            const newSelection = selectedFiles.includes(path)
                ? selectedFiles.filter((p) => p !== path)
                : [...selectedFiles, path];
            setSelectedFiles(newSelection);
        }
    };

    const toggleFolder = (path: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedFolders(newExpanded);
    };

    const buildFileTree = () => {
        const tree: any = {};

        files.forEach(file => {
            const parts = file.path.split('/');
            let current = tree;

            parts.forEach((part, index) => {
                if (!current[part]) {
                    current[part] = {
                        name: part,
                        path: parts.slice(0, index + 1).join('/'),
                        type: index === parts.length - 1 ? file.type : 'tree',
                        children: {},
                        file: index === parts.length - 1 ? file : null
                    };
                }
                current = current[part].children;
            });
        });

        return tree;
    };

    const renderTree = (node: any, level = 0) => {
        if (!node) return null;

        return Object.values(node).map((item: any) => {
            const isFolder = item.type === 'tree';
            const isExpanded = expandedFolders.has(item.path);
            const hasChildren = Object.keys(item.children).length > 0;

            // For folders, check if any child files are selected
            const childFiles = files.filter(file =>
                file.type === "blob" && file.path.startsWith(item.path + "/")
            );
            const selectedChildCount = childFiles.filter(file =>
                selectedFiles.includes(file.path)
            ).length;

            const isSelected = isFolder ?
                selectedChildCount > 0 :
                selectedFiles.includes(item.path);

            const isIndeterminate = isFolder && selectedChildCount > 0 && selectedChildCount < childFiles.length;

            return (
                <Box key={item.path}>
                    <Box
                        pl={level * 4}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: "rgba(139, 92, 246, 0.2)" }}
                        cursor="pointer"
                    >
                        <HStack gap={2}>
                            {isFolder && hasChildren && (
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFolder(item.path);
                                    }}
                                    cursor="pointer"
                                    p={1}
                                    _hover={{ bg: "rgba(139, 92, 246, 0.3)" }}
                                    borderRadius="sm"
                                >
                                    <Text fontSize="xs" color="whiteAlpha.700">
                                        {isExpanded ? "▼" : "▶"}
                                    </Text>
                                </Box>
                            )}

                            <Checkbox
                                isChecked={isSelected}
                                isIndeterminate={isIndeterminate}
                                onChange={() => handleSelect(item.path, item.type)}
                                onClick={(e) => e.stopPropagation()}
                            />

                            <HStack gap={2} onClick={() => {
                                if (isFolder && hasChildren) {
                                    toggleFolder(item.path);
                                }
                            }}>
                                <Box color={isFolder ? "yellow.300" : "blue.300"}>
                                    {isFolder ? <FolderIcon /> : <FileIcon />}
                                </Box>
                                <Text color="whiteAlpha.900" fontSize="sm">
                                    {item.name}
                                    {isFolder && childFiles.length > 0 && (
                                        <Text as="span" color="whiteAlpha.600" ml={2} fontSize="xs">
                                            ({selectedChildCount}/{childFiles.length})
                                        </Text>
                                    )}
                                </Text>
                            </HStack>
                        </HStack>
                    </Box>

                    {isFolder && isExpanded && hasChildren && (
                        <Box>
                            {renderTree(item.children, level + 1)}
                        </Box>
                    )}
                </Box>
            );
        });
    };

    if (files.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Text color="whiteAlpha.700">No files found matching your criteria.</Text>
            </Box>
        );
    }

    const fileTree = buildFileTree();
    const totalFiles = files.filter(f => f.type === "blob").length;

    return (
        <VStack align="stretch" gap={2}>
            <Box p={2} bg="rgba(139, 92, 246, 0.1)" borderRadius="md">
                <Text fontSize="sm" color="whiteAlpha.800">
                    {selectedFiles.length} of {totalFiles} files selected
                </Text>
            </Box>

            <Box
                maxH="400px"
                overflowY="auto"
                p={2}
                borderRadius="md"
                bg="rgba(255,255,255, 0.05)"
                border="1px solid"
                borderColor="rgba(139, 92, 246, 0.2)"
            >
                {renderTree(fileTree)}
            </Box>
        </VStack>
    );
};

export default GitExplorer;