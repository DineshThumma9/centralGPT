import {
    Box, Button, FileUpload, Float,
    HStack,
    IconButton,
    Input, Menu, Portal,
    Textarea,
    VStack
} from "@chakra-ui/react";
import {Search, Send} from "lucide-react";
import {useState} from "react";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import {v4} from "uuid";
import {z} from "zod/v4";
import MultiMediaDropDown from "./MultiMediaDropDown.tsx";
import Message from "../entities/Message.ts";
import {HiUpload} from "react-icons/hi";
import {LuX} from "react-icons/lu";

const SendRequest = () => {
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const {tstMsgFunc} = useSessions();
    const {addMessage} = sessionStore();

    type MessageType = z.infer<typeof Message>;

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        const currentSession = sessionStore.getState().current_session;

        if (!currentSession) {
            console.error("No session selected.");
            return;
        }

        const message: MessageType = {
            session_id: v4(),
            message_id: v4(),
            content: input.trim(),
            sender: "user",
            timestamp: new Date().toISOString()
        };

        addMessage(message);

        try {
            setSending(true);
            setInput("");
            await tstMsgFunc(input.trim());
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    return (
        <Box
            w="full"
            px={4}
            py={3}
               maxW="100vw"
                maxH = "100vh"
            bg="app.bg"
            // borderColor={"gray.200"}
            display="flex"
            justifyContent="center"
        >
            <HStack
                w="100%"
                maxW="100vw"
                maxH = "100vh"
                bg="white"
                borderRadius="xl"
                px={4}
                py={3}
                gap={4}
                alignItems="flex-end"
                // borderColor={"gray.200"}
                // boxShadow="md"
            >
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="outline" size="sm">
                            Media
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content p = "0px" border={"0px"} margin = "0px">
                                <Menu.Item value="pdf" border = "0px">
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
                                                                    <FileUpload.ItemDeleteTrigger boxSize="4"
                                                                                                  layerStyle="fill.solid">
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


                {/*<Box position="relative" border={"0px"} flex="1">*/}

                <Textarea
                    resize="none"
                    minH="56px"
                    maxH="120px"
                    border={"0px"}
                    borderRadius="xl"
                    pl="36px"
                    pr="4"
                    py="3"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    fontSize="md"
                    // borderColor="gray.300"
                    _placeholder={{color: "gray.400"}}
                />
                {/*</Box>*/}

                <IconButton
                    aria-label="Send message"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || sending}
                    size="lg"
                    bg={"white"}
                    color="black"
                    borderRadius="full"
                    transition="all 0.2s"
                    _hover={{transform: "scale(1.05)"}}
                    _active={{transform: "scale(0.95)"}}
                >
                    <Send/>
                </IconButton>

            </HStack>
        </Box>
    );
};

export default SendRequest;
