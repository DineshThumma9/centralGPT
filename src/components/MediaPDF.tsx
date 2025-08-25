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
import { useRef, useEffect, useCallback } from "react";
import { useColorMode } from "../contexts/ColorModeContext";

interface Props {
  children: ReactNode;
}

const MediaPDF = ({ children }: Props) => {
  const { files, setFiles, removeFile } = useSessionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { colors } = useColorMode();
  const fileUploadRef = useRef<any>(null);


  const handleFileChange = useCallback((details: any) => {


    if (!details.acceptedFiles || details.acceptedFiles.length === 0) {
      return;
    }


    const newFiles = details.acceptedFiles.filter((newFile: File) => {
      return !files.some(existingFile => 
        existingFile.name === newFile.name &&
        existingFile.size === newFile.size &&
        existingFile.lastModified === newFile.lastModified
      );
    });

    if (newFiles.length > 0) {


      setFiles(newFiles);
    }
  }, [files, setFiles]);


  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);


  const handleRemoveFile = useCallback((index: number) => {
    removeFile(index);


    if (files.length === 1) {
      clearFileInput();
    }
  }, [files.length, removeFile, clearFileInput]);


  useEffect(() => {
    if (files.length === 0 && fileInputRef.current?.files?.length) {
      clearFileInput();
    }
  }, [files.length, clearFileInput]);

  return (
    <FileUpload.Root
      ref={fileUploadRef}
      maxFiles={5}
      onFileChange={handleFileChange}
      justifyContent="flex-start"
      key={files.length} // Force re-render when files change
    >
      {/* File display section */}
      {files.length > 0 && (
        <Box
          w="100%"
          maxW="100%"
          overflowX="auto"
          pb={2}
   
        >
          <HStack gap={2} minW="max-content" color="white">
            {files.map((file, index) => {
              // Create unique key to prevent React issues
              const fileKey = `${file.name}-${file.size}-${file.lastModified}-${index}`;
              
              return (
                <Box
                  key={fileKey}
                  minW="240px"
                  maxW="240px"
                  h="50px"
                  bg={colors.background.card}
                  border={`1px solid ${colors.border.default}`}
                  borderRadius="12px"
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  position="relative"
                  flexShrink={0}
                >
                  <HStack gap={3} flex={1} overflow="hidden">
                    <Box fontSize="24px" color={colors.text.primary} flexShrink={0}>
                      📄
                    </Box>
                    <Box 
                      fontSize="sm" 
                      fontWeight="500" 
                      color={colors.text.primary} 
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      flex={1}
                      title={file.name} // Tooltip for full name
                    >
                      {file.name}
                    </Box>
                  </HStack>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                    color={colors.text.muted}
                    flexShrink={0}
                    _hover={{ bg: colors.background.hover }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              );
            })}
          </HStack>
        </Box>
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