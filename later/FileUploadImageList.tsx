"use client"

import {
  Button,
  FileUpload,
  Float,
  useFileUploadContext,
} from "@chakra-ui/react"
import { LuFileImage, LuX } from "react-icons/lu"

const FileUploadImageList = () => {
  const fileUpload = useFileUploadContext()
  const files = fileUpload.acceptedFiles
  if (files.length === 0) return null
  return (
    <FileUpload.ItemGroup>
      {files.map((file) => (
        <FileUpload.Item
          w="auto"
          boxSize="10"
          p="2"
          file={file}
          borderRadius = "40px"
          key={file.name}
        >
          <FileUpload.ItemPreviewImage />
          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger boxSize="2" layerStyle="fill.outline">
              <LuX />
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  )
}


export default FileUploadImageList;
