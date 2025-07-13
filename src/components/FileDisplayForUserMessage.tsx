import {Box, HStack} from "@chakra-ui/react";


interface FileDisplayProps {
  files: File[];
}

const FileDisplayForUserMessage = ({ files }: FileDisplayProps) => {
  if (!files || files.length === 0) return null;

  return (
    <HStack overflowX="auto" gap={2} pb={2} justifyContent={"flex-start"} color={"white"}>
      {files.map((file, index) => (
        <Box
          key={`${file.name}-${index}-${file.lastModified}`}
          minW="240px"
          maxW="240px"
          h="50px"
          bg="rgba(139, 92, 246, 0.15)"
          border="1px solid rgba(139, 92, 246, 0.3)"
          borderRadius="12px"
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          position="relative"
        >
          <HStack gap={3} flex={1} overflow="hidden">
            <Box fontSize="24px" color={"white"}>
              📄
            </Box>
            <Box fontSize="sm" fontWeight="500" color={"white"} truncate>
              {file.name}
            </Box>
          </HStack>
        </Box>
      ))}
    </HStack>
  );
};

export default FileDisplayForUserMessage;