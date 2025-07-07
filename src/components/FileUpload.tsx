
import {Button, FileUpload, HStack} from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"
import  FileUploadList from "./FileItem.tsx";

const MediaPDF = () => {
  return (
    <FileUpload.Root maxFiles={5} >
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm" bg={"transparent"}  color={"white"} border={"0px"}>
          <HiUpload />
        </Button>
      </FileUpload.Trigger>


            <FileUploadList/>

    </FileUpload.Root>
  )
}


export default MediaPDF;