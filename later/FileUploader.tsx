import {Button, FileUpload, HStack} from "@chakra-ui/react"
import {HiUpload} from "react-icons/hi"
import type {ReactNode} from "react";


interface Props {
    max_no: number
    type: string[]
    preview?: boolean
    allow_drop?: boolean
    onFileAccept: () => void
    max_file_size: number
    children: ReactNode
    label: string


}

const FileUploader = ({max_no, type, children, label, preview, allow_drop, max_file_size}: Props) => {
    return (
        <FileUpload.Root maxFiles={max_no} allowDrop={allow_drop} maxFileSize={max_file_size} accept={type}>
            <FileUpload.HiddenInput/>
            <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                    <HiUpload/> {label}
                </Button>
            </FileUpload.Trigger>
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
            <FileUpload.ItemGroup>

                {children}
            </FileUpload.ItemGroup>
        </FileUpload.Root>
    )
}

export default FileUploader;
