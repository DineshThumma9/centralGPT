"use client"

import {Portal, Select, createListCollection, HStack, FileUpload, FileUploadList} from "@chakra-ui/react"
import FileUploader from "./FileUploader.tsx";

interface Props {
    collection: string
    label: string

}

const SelectOptions = () => {
    return (
        <Select.Root collection={File[]}  size="sm" width="320px">
            <Select.HiddenSelect/>
            <Select.Label></Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select framework"/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator/>
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        <FileUploader max_no={3} label={"pdf"} type={[".pdf"]} onFileAccept={onFileAccept}
                                      max_file_size={25}>
                            <HStack>
                                <FileUpload.List showSize clearable/>
                            </HStack>
                        </FileUploader>
                        <FileUploader max_no={3} label={"Images"} type={["image/*"]} onFileAccept={onFileAccept}
                                      max_file_size={25}>
                            <FileUploadList/>
                        </FileUploader>
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

