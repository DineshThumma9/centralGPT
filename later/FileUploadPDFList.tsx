"use client"

import {
    Button,
    FileUpload,
    Float, HStack,
    useFileUploadContext,
} from "@chakra-ui/react"
import {LuFileImage, LuX} from "react-icons/lu"
import {HiUpload} from "react-icons/hi";

const FileUploadPDFList = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null
    return (
        <FileUpload.Root maxFiles={5}>
            <FileUpload.HiddenInput/>
            <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                    <HiUpload/> Upload file
                </Button>
            </FileUpload.Trigger>
            <HStack>
                <FileUpload.ItemGroup>
                    <FileUpload.Context>
                        {({acceptedFiles}) =>
                            acceptedFiles.map((file) => (
                                <FileUpload.Item key={file.name} file={file}>
                                    <FileUpload.ItemPreview/>
                                    <FileUpload.ItemName/>
                                    <FileUpload.ItemSizeText/>
                                    <FileUpload.ItemDeleteTrigger/>
                                </FileUpload.Item>
                            ))
                        }
                    </FileUpload.Context>
                </FileUpload.ItemGroup>
            </HStack>

        </FileUpload.Root>
    )
}


export default FileUploadPDFList;



