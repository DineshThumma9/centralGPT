
"use client"

import {
  Button,
  FileUpload,
  Float,
    HStack,
  useFileUploadContext,
} from "@chakra-ui/react"
import { LuFileImage, LuX } from "react-icons/lu"
import {useScroll} from "framer-motion";

const FileUploadList = () => {






  return (

      <FileUpload.ItemGroup color={"transparent"} >
          <HStack
              overflowX={"auto"}
          >
  <FileUpload.Context>

    {({ acceptedFiles }) =>
      acceptedFiles.map((file) => (



        <FileUpload.Item
            key={file.name}
            file={file}

            width={"250px"}
            color={"purple.500"}
            borderRadius={"20px"}
        >
          <FileUpload.ItemPreview />
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText />
          <FileUpload.ItemDeleteTrigger />
        </FileUpload.Item>

      ))
    }

  </FileUpload.Context>
          </HStack>
</FileUpload.ItemGroup>


  )
}


export default FileUploadList;

