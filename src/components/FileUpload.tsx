
import {Button, FileUpload, HStack} from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"
import  FileUploadList from "./FileItem.tsx";
import {MdAttachment} from "react-icons/md";
import {IoAttach} from "react-icons/io5";

const MediaPDF = () => {
  return (
    <FileUpload.Root maxFiles={5} >
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button size="md" bg={"transparent"}  color={"white"} border={"0px"}>
          <IoAttach/>
        </Button>
      </FileUpload.Trigger>


            <FileUploadList/>

    </FileUpload.Root>
  )
}


export default MediaPDF;