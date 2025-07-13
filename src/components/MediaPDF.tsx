import {
  FileUpload,
  Button,
  HStack,
  Box,
  IconButton
} from "@chakra-ui/react";
import { IoAttach } from "react-icons/io5";
import { X } from "lucide-react";
import type {ReactNode} from "react";
import useSessionStore from "../store/sessionStore.ts";
import { useRef } from "react";

interface Props {
  children: ReactNode;
}

const MediaPDF = ({ children }: Props) => {
  const { files, addFiles, removeFile, clearFiles } = useSessionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (details: any) => {
    // Clear existing files first to avoid duplication
    clearFiles();
    // Add new files
    details.acceptedFiles.forEach(addFiles);
  };

  // Function to clear the file input
  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FileUpload.Root
      maxFiles={5}
      onFileChange={handleFileChange}
      justifyContent={"flex-start"}
    >
      {/* Custom file display */}
      {files.length > 0 && (
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
              <IconButton
                size="xs"
                variant="ghost"
                onClick={() => {
                  removeFile(index);
                  // If no files left, clear the input
                  if (files.length === 1) {
                    clearFileInput();
                  }
                }}
                aria-label="Remove file"
                color="white"
                _hover={{ bg: "rgba(139, 92, 246, 0.3)" }}
              >
                <X size={14} />
              </IconButton>
            </Box>
          ))}
        </HStack>
      )}

      <FileUpload.HiddenInput ref={fileInputRef} />
      {children}
      <FileUpload.Trigger asChild>
        <Button size="md" bg="transparent" color="white" border="0px">
          <IoAttach />
        </Button>
      </FileUpload.Trigger>
    </FileUpload.Root>
  );
};

export default MediaPDF;