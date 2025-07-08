"use client"

import {FileUpload, HStack,} from "@chakra-ui/react"

const FileUploadList = () => {






  return (

      <FileUpload.ItemGroup color={"transparent"}  justifySelf={"flex-start"}>
          <HStack
              overflowX={"auto"}
              justifySelf={"flex-start"}

          >
  <FileUpload.Context>

    {({ acceptedFiles }) =>
      acceptedFiles.map((file) => (



        <FileUpload.Item
            key={file.name}
            file={file}
            justifyContent={"space-between"}
              bg={"rgba(147, 51, 234, 0.4)"}
            width={"250px"}
            color={"whiteAlpha.50"}
            border={"0px"}
            borderRadius={"10px"}
        >
          <FileUpload.ItemPreview color={"white"}/>
          <FileUpload.ItemName color={"whitesmoke"} />
          {/*<FileUpload.ItemSizeText />*/}
          <FileUpload.ItemDeleteTrigger justifySelf={"flex-end"}  alignSelf={"end"} color={"whitesmoke"} />
        </FileUpload.Item>

      ))
    }

  </FileUpload.Context>
          </HStack>
</FileUpload.ItemGroup>


  )
}


export default FileUploadList;

