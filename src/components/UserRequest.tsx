import {Box, Editable, Flex, HStack, IconButton, VStack, Clipboard} from "@chakra-ui/react";
import {type Message} from "../entities/Message.ts";
import {LuCheck, LuX, LuCopy} from "react-icons/lu";
import FileDisplayForUserMessage from "./FileDisplayForUserMessage.tsx";


interface Props {
    msg: Message;
}

const UserRequest = ({msg}: Props) => {

    const editableInput = {
        wordBreak: "break-word" as const,
        overflowWrap: "break-word" as const,
        whiteSpace: "pre-wrap" as const,
        bg: "bg.surface",
        border: "1px solid",
        borderColor: "border.default",
        color: "fg.default",
        _focus: {
            borderColor: "border.accent",
            boxShadow: `0 0 0 1px token(colors.border.accent)`
        }
    }

    const editableIcon = {
        variant: "outline" as const,
        size: "xs" as const,
        bg: "bg.canvas",
        color: { base: "brand.700", _dark: "brand.600" },
        border: "1px solid",
        borderColor: "border.default",
        transition: "all 0.2s ease",
        _hover: {
            bg: { base: "brand.50", _dark: "brand.950" },
            borderColor: { base: "brand.300", _dark: "brand.700" },
            color: { base: "brand.800", _dark: "brand.500" },
            transform: "scale(1.05)"
        }
    }

    return (
        <Flex
            direction="column"
            align="flex-end"
            w="100%"
            maxW="100%"

            px={2} // Optional small padding
        >

            <Flex
                align="flex-end"
                direction="row"
                gap={3}
                w="100%"
                justify="flex-end"
            >
                {/* Files Section */}
                <VStack align="flex-end" gap={1} maxW="80%">
                    {msg.files && msg.files.length > 0 && (
                        <Box maxW="full">
                            <FileDisplayForUserMessage files={msg.files}/>
                        </Box>
                    )}
                    <Box maxW="full" display="inline-block">
                        <Box css={{ userRequest: {} }}>
                            <Editable.Root defaultValue={msg.content}>
                                <Editable.Preview
                                    wordBreak="break-word"
                                    overflowWrap="break-word"
                                    whiteSpace="pre-wrap"
                                />
                                <Editable.Input {...editableInput} />
                                <Editable.Control>
                                    <Editable.CancelTrigger asChild>
                                        <IconButton
                                            {...editableIcon}
                                            aria-label="Cancel edit"
                                        >
                                            <LuX/>
                                        </IconButton>
                                    </Editable.CancelTrigger>
                                    <Editable.SubmitTrigger asChild>
                                        <IconButton
                                            {...editableIcon}
                                            aria-label="Submit edit"
                                        >
                                            <LuCheck/>
                                        </IconButton>
                                    </Editable.SubmitTrigger>
                                </Editable.Control>
                            </Editable.Root>
                        </Box>
                    </Box>
                </VStack>


            </Flex>

            {/* Action buttons */}
            <HStack gap={2}>
                <Clipboard.Root value={msg.content.trimEnd()}>
                    <Clipboard.Trigger asChild>
                        <IconButton
                            size="xs"
                            variant="outline"
                            color={{ base: "#374151", _dark: "#d1d5db" }}
                            borderColor={{ base: "#d1d5db", _dark: "#6b7280" }}
                            bg={{ base: "white", _dark: "#1f2937" }}
                            _hover={{ 
                                bg: { base: "#f3f4f6", _dark: "#374151" },
                                borderColor: { base: "#9ca3af", _dark: "#9ca3af" },
                                color: { base: "#111827", _dark: "#f9fafb" }
                            }}
                            _active={{
                                bg: { base: "#e5e7eb", _dark: "#4b5563" },
                            }}
                            aria-label="Copy message"
                        >
                            <Clipboard.Indicator copied={<LuCheck color="#22c55e" />}>
                                <LuCopy />
                            </Clipboard.Indicator>
                        </IconButton>
                    </Clipboard.Trigger>
                </Clipboard.Root>
            </HStack>
        </Flex>
    );
};

export default UserRequest;