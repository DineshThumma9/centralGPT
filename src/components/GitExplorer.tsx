"use client"

import {Box, Breadcrumb, Button, Checkbox, HStack, Input, Text, VStack,} from "@chakra-ui/react"
import {useMemo, useState} from "react"
import {LuChevronRight, LuFile, LuFolder, LuSearch} from "react-icons/lu"

// GitTreeNode type that matches your existing schema
export interface GitTreeNode {
    name: string
    path: string
    type: "tree" | "blob"
    sha?: string
    size?: number
    children?: GitTreeNode[] | null
}

interface GitExplorerProps {
    files: GitTreeNode[]
    selectedFiles: string[]
    setSelectedFiles: (files: string[]) => void
}

const GitExplorer = ({ files, selectedFiles, setSelectedFiles }: GitExplorerProps) => {
    const [currentPath, setCurrentPath] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    // Build a flat map of all files for easy lookup
    const flatFileMap = useMemo(() => {
        const map = new Map<string, GitTreeNode>()

        const traverse = (nodes: GitTreeNode[]) => {
            nodes.forEach(node => {
                map.set(node.path, node)
                if (node.children) {
                    traverse(node.children)
                }
            })
        }

        traverse(files)
        return map
    }, [files])

    // Get current directory contents
    const currentNodes = useMemo(() => {
        if (currentPath.length === 0) {
            return files
        }

        const currentPathString = currentPath.join("/")
        const currentNode = flatFileMap.get(currentPathString)
        return currentNode?.children || []
    }, [currentPath, files, flatFileMap])

    // Filter nodes based on search query
    const filteredNodes = useMemo(() => {
        if (!searchQuery.trim()) {
            return currentNodes
        }

        return currentNodes.filter(node =>
            node.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [currentNodes, searchQuery])

    // Handle file/folder selection
    const handleNodeClick = (node: GitTreeNode) => {
        if (node.type === "tree") {
            // Navigate into directory
            const newPath = node.path.split("/").filter(Boolean)
            setCurrentPath(newPath)
        } else {
            // Toggle file selection
            const isSelected = selectedFiles.includes(node.path)
            if (isSelected) {
                setSelectedFiles(selectedFiles.filter(path => path !== node.path))
            } else {
                setSelectedFiles([...selectedFiles, node.path])
            }
        }
    }

    // Handle breadcrumb navigation
    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setCurrentPath([])
        } else {
            setCurrentPath(currentPath.slice(0, index + 1))
        }
    }

    // Select/deselect all visible files
    const handleSelectAll = () => {
        const visibleFiles = filteredNodes.filter(node => node.type === "blob")
        const visibleFilePaths = visibleFiles.map(file => file.path)

        const allSelected = visibleFilePaths.every(path => selectedFiles.includes(path))

        if (allSelected) {
            // Deselect all visible files
            setSelectedFiles(selectedFiles.filter(path => !visibleFilePaths.includes(path)))
        } else {
            // Select all visible files
            const newSelected = [...new Set([...selectedFiles, ...visibleFilePaths])]
            setSelectedFiles(newSelected)
        }
    }

    // Get breadcrumb items
    const breadcrumbItems = useMemo(() => {
        return currentPath.map((segment, index) => ({
            name: segment,
            index
        }))
    }, [currentPath])

    // Check if all visible files are selected
    const visibleFiles = filteredNodes.filter(node => node.type === "blob")
    const allVisibleSelected = visibleFiles.length > 0 &&
        visibleFiles.every(file => selectedFiles.includes(file.path))

    return (
        <VStack gap={4} align="stretch" maxH="500px">
            {/* Search and Controls */}
            <HStack gap={3}>
                <Box position="relative" flex={1}>
                    <Box
                        position="absolute"
                        left="12px"
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={1}
                        color="rgba(255, 255, 255, 0.6)"
                    >
                        <LuSearch />
                    </Box>
                    <Input
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        pl="40px"
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="rgba(139, 92, 246, 0.3)"
                        bg="rgba(139, 92, 246, 0.05)"
                        color="white"
                        _placeholder={{ color: "rgba(255, 255, 255, 0.6)" }}
                        _hover={{
                            borderColor: "rgba(139, 92, 246, 0.5)",
                            bg: "rgba(139, 92, 246, 0.1)"
                        }}
                        _focus={{
                            borderColor: "rgba(139, 92, 246, 0.6)",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                            bg: "rgba(139, 92, 246, 0.1)"
                        }}
                    />
                </Box>

                {visibleFiles.length > 0 && (
                    <Button
                        size="sm"
                        variant="ghost"
                        color="white"
                        onClick={handleSelectAll}
                        borderRadius="xl"
                        _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                    >
                        {allVisibleSelected ? "Deselect All" : "Select All"}
                    </Button>
                )}
            </HStack>



            {/* Breadcrumb Navigation */}
            <Breadcrumb.Root
                gap="8px"
                fontSize="sm"
            >
                <Breadcrumb.Item>
                    <Breadcrumb.Link
                        onClick={() => handleBreadcrumbClick(-1)}
                        color="rgba(255, 255, 255, 0.7)"
                        _hover={{ color: "white" }}
                        display="flex"
                        alignItems="center"
                        gap="4px"
                    >
                        Root
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                {breadcrumbItems.map(({ name, index }) => (
                    <Breadcrumb.Item key={index}>
                        <Box color="rgba(255, 255, 255, 0.4)">
                            <LuChevronRight />
                        </Box>
                        <Breadcrumb.Link
                            onClick={() => handleBreadcrumbClick(index)}
                            color="rgba(255, 255, 255, 0.7)"
                            _hover={{ color: "white" }}
                            ml={2}
                        >
                            {name}
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb.Root>

            {/* Selection Summary */}
            {selectedFiles.length > 0 && (
                <Text
                    fontSize="sm"
                    color="rgba(255, 255, 255, 0.7)"
                    bg="rgba(139, 92, 246, 0.1)"
                    p={2}
                    borderRadius="lg"
                    border="1px solid rgba(139, 92, 246, 0.2)"
                >
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </Text>
            )}

            {/* File Tree */}
            <Box
                flex={1}
                overflow="auto"
                border="2px solid rgba(139, 92, 246, 0.2)"
                borderRadius="xl"
                bg="rgba(139, 92, 246, 0.02)"
                p={3}
                maxH="300px"
            >
                {filteredNodes.length === 0 ? (
                    <HStack justify="center" align="center" h="100px">
                        <Text color="rgba(255, 255, 255, 0.6)">
                            {searchQuery ? "No files match your search" : "No files found"}
                        </Text>
                    </HStack>
                ) : (
                    <VStack align="stretch" gap={1}>
                        {filteredNodes.map((node) => (
                            <HStack
                                key={node.path}
                                p={2}
                                borderRadius="lg"
                                _hover={{ bg: "rgba(139, 92, 246, 0.1)" }}
                                cursor="pointer"
                                onClick={() => handleNodeClick(node)}
                                justify="space-between"
                                w="full"
                                transition="background-color 0.2s"
                            >
                                <HStack gap={2} flex={1}>
                                    {node.type === "tree" ? (
                                        <>
                                            <Box color="rgba(139, 92, 246, 0.8)">
                                                <LuFolder />
                                            </Box>
                                            <Text color="white" fontSize="sm">
                                                {node.name}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Box color="rgba(255, 255, 255, 0.6)">
                                                <LuFile />
                                            </Box>
                                            <Text color="rgba(255, 255, 255, 0.9)" fontSize="sm">
                                                {node.name}
                                            </Text>
                                            {node.size && (
                                                <Text color="rgba(255, 255, 255, 0.5)" fontSize="xs">
                                                    ({(node.size / 1024).toFixed(1)}KB)
                                                </Text>
                                            )}
                                        </>
                                    )}
                                </HStack>

                                {node.type === "blob" && (
                                    <Checkbox.Root
                                        colorScheme="purple"
                                        checked={selectedFiles.includes(node.path)}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleNodeClick(node)
                                        }}
                                    />
                                )}
                            </HStack>
                        ))}
                    </VStack>
                )}
            </Box>
        </VStack>
    )
}

export default GitExplorer