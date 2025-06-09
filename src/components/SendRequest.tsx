import {
    Box, Button, FileUpload, Float,
    HStack,
    IconButton,
    Textarea,
    Menu, Portal,
    Text,
} from "@chakra-ui/react";
import {Send, Paperclip} from "lucide-react";
import {useState, useRef} from "react";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import {v4} from "uuid";
import {z} from "zod/v4";
import Message from "../entities/Message.ts";
import {HiUpload} from "react-icons/hi";
import {LuX} from "react-icons/lu";

const SendRequest = () => {
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const {tstMsgFunc} = useSessions();
    const {addMessage} = sessionStore();

    type MessageType = z.infer<typeof Message>;

    const handleSendMessage = async () => {
        if (!input.trim() || sending) return;

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
            const messageContent = input.trim();
            setInput("");

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }

            await tstMsgFunc(messageContent);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);

        // Auto-resize textarea
        const textarea = e.target;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = Math.min(scrollHeight, 120) + 'px';
    };

    return (
        <Box
            w="full"
            bg="app.bg"
            py={4}
            px={4}
        >
            <Box
                maxW="1200px"
                mx="auto"
                w="full"
            >
                {/* Input Container */}
                <HStack
                    bg="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    px={4}
                    py={3}
                    gap={3}
                    alignItems="flex-end"
                    boxShadow="sm"
                    _focusWithin={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                    }}
                    transition="all 0.2s"
                >
                    {/* Media Upload Button */}
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                color="gray.500"
                                _hover={{
                                    color: "gray.700",
                                    bg: "gray.100"
                                }}
                                aria-label="Attach media"
                            >
                                <Paperclip size={18} />
                            </IconButton>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    boxShadow="lg"
                                    p={2}
                                    minW="200px"
                                >
                                    <Menu.Item
                                        value="pdf"
                                        p={0}
                                        border="none"
                                        _hover={{ bg: "transparent" }}
                                    >
                                        <FileUpload.Root maxFiles={5} accept=".pdf">
                                            <FileUpload.HiddenInput />
                                            <FileUpload.Trigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    w="full"
                                                    justifyContent="flex-start"
                                                    color="gray.700"
                                                    _hover={{ bg: "gray.50" }}
                                                >
                                                    <HiUpload />
                                                    Upload PDFs
                                                </Button>
                                            </FileUpload.Trigger>
                                            <FileUpload.ItemGroup>
                                                <FileUpload.Context>
                                                    {({acceptedFiles}) =>
                                                        acceptedFiles.map((file) => (
                                                            <HStack key={file.name} p={2} bg="gray.50" borderRadius="md" mt={2}>
                                                                <FileUpload.Item file={file}>
                                                                    <Text fontSize="sm" flex="1">{file.name}</Text>
                                                                    <FileUpload.ItemDeleteTrigger>
                                                                        <IconButton size="xs" variant="ghost">
                                                                            <LuX />
                                                                        </IconButton>
                                                                    </FileUpload.ItemDeleteTrigger>
                                                                </FileUpload.Item>
                                                            </HStack>
                                                        ))
                                                    }
                                                </FileUpload.Context>
                                            </FileUpload.ItemGroup>
                                        </FileUpload.Root>
                                    </Menu.Item>

                                    <Menu.Item
                                        value="img"
                                        p={0}
                                        border="none"
                                        _hover={{ bg: "transparent" }}
                                    >
                                        <FileUpload.Root maxFiles={5} accept="image/*">
                                            <FileUpload.HiddenInput />
                                            <FileUpload.Trigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    w="full"
                                                    justifyContent="flex-start"
                                                    color="gray.700"
                                                    _hover={{ bg: "gray.50" }}
                                                >
                                                    <HiUpload />
                                                    Upload Images
                                                </Button>
                                            </FileUpload.Trigger>
                                            <FileUpload.ItemGroup>
                                                <FileUpload.Context>
                                                    {({acceptedFiles}) =>
                                                        acceptedFiles.map((file) => (
                                                            <HStack key={file.name} p={2} bg="gray.50" borderRadius="md" mt={2}>
                                                                <FileUpload.Item file={file}>
                                                                    <FileUpload.ItemPreviewImage boxSize="8" />
                                                                    <Text fontSize="sm" flex="1">{file.name}</Text>
                                                                    <Float placement="top-end">
                                                                        <FileUpload.ItemDeleteTrigger>
                                                                            <IconButton size="xs" variant="ghost">
                                                                                <LuX />
                                                                            </IconButton>
                                                                        </FileUpload.ItemDeleteTrigger>
                                                                    </Float>
                                                                </FileUpload.Item>
                                                            </HStack>
                                                        ))
                                                    }
                                                </FileUpload.Context>
                                            </FileUpload.ItemGroup>
                                        </FileUpload.Root>
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>

                    {/* Text Input */}
                    <Textarea
                        ref={textareaRef}
                        resize="none"
                        minH="44px"
                        maxH="120px"
                        border="none"
                        outline="none"
                        px={0}
                        py={2}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        fontSize="md"
                        lineHeight="1.5"
                        _placeholder={{ color: "gray.400" }}
                        _focus={{
                            boxShadow: "none",
                            outline: "none"
                        }}
                        disabled={sending}
                        style={{
                            height: 'auto',
                            overflow: 'hidden'
                        }}
                    />

                    {/* Send Button */}
                    <IconButton
                        aria-label="Send message"
                        onClick={handleSendMessage}
                        disabled={!input.trim() || sending}
                        size="md"
                        bg={input.trim() && !sending ? "blue.500" : "gray.300"}
                        color="white"
                        borderRadius="lg"
                        transition="all 0.2s"
                        _hover={{
                            bg: input.trim() && !sending ? "blue.600" : "gray.300",
                            transform: input.trim() && !sending ? "scale(1.05)" : "none"
                        }}
                        _active={{
                            transform: input.trim() && !sending ? "scale(0.95)" : "none"
                        }}
                        _disabled={{
                            cursor: "not-allowed",
                            opacity: 0.6
                        }}
                    >
                        <Send size={18} />
                    </IconButton>
                </HStack>

                {/* Character count or status */}
                {input.length > 0 && (
                    <HStack justify="flex-end" mt={2}>
                        <Text fontSize="xs" color="gray.500">
                            {sending ? "Sending..." : `${input.length} characters`}
                        </Text>
                    </HStack>
                )}
            </Box>
        </Box>
    );
};

export default SendRequest;