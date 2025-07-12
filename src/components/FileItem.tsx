"use client";

import { FileUpload, HStack, Box } from "@chakra-ui/react";
import useSessionStore from "../store/sessionStore.ts";

const FileUploadList = () => {
  const { files, removeFile } = useSessionStore();

  return (

      <FileUpload.ItemGroup color={"white"}>
        <HStack overflowX="auto" gap={2} pb={2} justifyContent={"flex-start"} color={"white"}>
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
                    <FileUpload.ItemPreview fontSize="24px" color={"white"} />
                      <FileUpload.ItemName fontSize="sm" fontWeight="500" mb={1} color={"white"} />
                      <FileUpload.ItemSizeText fontSize="xs" color={"white"}/>
                  </HStack >
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


  );
};

export default FileUploadList;
