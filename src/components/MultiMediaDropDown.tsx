import {Button, FileUpload, Float, HStack, Menu, Portal} from "@chakra-ui/react";
import {HiUpload} from "react-icons/hi";
import {LuX} from "react-icons/lu";

const MultiMediaDropDown = () => {
    const onFileAccept = () => {};

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                    Media
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="pdf">
                            <FileUpload.Root maxFiles={5}>
                                <FileUpload.HiddenInput/>
                                <FileUpload.Trigger asChild>
                                    <Button variant="outline" size="sm">
                                        <HiUpload/> Upload PDFs
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
                        </Menu.Item>
                        <Menu.Item value="img">
                            <FileUpload.Root maxFiles={5}>
                                <FileUpload.HiddenInput/>
                                <FileUpload.Trigger asChild>
                                    <Button variant="outline" size="sm">
                                        <HiUpload/> Upload Images
                                    </Button>
                                </FileUpload.Trigger>
                                <HStack>
                                    <FileUpload.ItemGroup>
                                        <FileUpload.Context>
                                            {({acceptedFiles}) =>
                                                acceptedFiles.map((file) => (
                                                    <FileUpload.Item
                                                        w="auto"
                                                        boxSize="20"
                                                        p="2"
                                                        file={file}
                                                        key={file.name}
                                                    >
                                                        <FileUpload.ItemPreviewImage/>
                                                        <Float placement="top-end">
                                                            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                                                                <LuX/>
                                                            </FileUpload.ItemDeleteTrigger>
                                                        </Float>
                                                    </FileUpload.Item>
                                                ))
                                            }
                                        </FileUpload.Context>
                                    </FileUpload.ItemGroup>
                                </HStack>
                            </FileUpload.Root>
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

export default MultiMediaDropDown;