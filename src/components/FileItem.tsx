"use client";

import { FileUpload, HStack, Box } from "@chakra-ui/react";
import useSessionStore from "../store/sessionStore.ts";

const FileUploadList = () => {
  const { files, removeFile } = useSessionStore();

  return (
    <Box position="relative" mb={2} maxW="1000px" mx="auto">
      <FileUpload.ItemGroup>
        <HStack overflowX="auto" gap={2} pb={2}>
          <FileUpload.Context>
            {({ acceptedFiles }) =>
              acceptedFiles.map((file,index) => (
                <FileUpload.Item
                  key={file.name}
                  file={file}
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
                    <FileUpload.ItemPreview fontSize="24px" />
                    <Box flex={1} overflow="hidden">
                      <FileUpload.ItemName fontSize="sm" fontWeight="500" mb={1} />
                      <FileUpload.ItemSizeText fontSize="xs" />
                    </Box>
                  </HStack>
                  <FileUpload.ItemDeleteTrigger
                    onClick={() => removeFile(index)}
                    ml={2}
                  />
                </FileUpload.Item>
              ))
            }
          </FileUpload.Context>
        </HStack>
      </FileUpload.ItemGroup>
    </Box>
  );
};

export default FileUploadList;
