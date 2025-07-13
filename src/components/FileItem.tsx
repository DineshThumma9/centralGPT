"use client";

import { FileUpload, HStack, Box, IconButton } from "@chakra-ui/react";
import { X } from "lucide-react";
import useSessionStore from "../store/sessionStore.ts";

interface FileItemProps {
  files: File[];
  onRemove: (index: number) => void;
  isUserMessage?: boolean;
}

const FileUploadList = ({ files, onRemove, isUserMessage = false }: FileItemProps) => {
  if (files.length === 0) return null;

  return (
    <HStack overflowX="auto" gap={2} pb={2} justifyContent={"flex-start"} color={"white"}>
      {files.map((file, index) => (
        <Box
          key={`${file.name}-${index}`}
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
          {!isUserMessage && (
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => onRemove(index)}
              aria-label="Remove file"
              color="white"
              _hover={{ bg: "rgba(139, 92, 246, 0.3)" }}
            >
              <X size={14} />
            </IconButton>
          )}
        </Box>
      ))}
    </HStack>
  );
};

// For SendRequest component
const FileUploadListForSendRequest = () => {
  const { files, removeFile } = useSessionStore();

  return (
    <FileUpload.ItemGroup color={"white"}>
      <FileUploadList files={files} onRemove={removeFile} />
    </FileUpload.ItemGroup>
  );
};


export default FileUploadListForSendRequest;
export { FileUploadList };