import {Box, Editable, Flex, HStack, IconButton, VStack} from "@chakra-ui/react";
import {type Message} from "../entities/Message.ts";
import {Check, Copy} from "lucide-react";
import {LuCheck, LuX} from "react-icons/lu";
import {toaster} from "./ui/toaster.tsx";
import {useState} from "react";
import FileDisplayForUserMessage from "./FileDisplayForUserMessage.tsx";

interface Props {
    msg: Message;
}

const UserRequest = ({msg}: Props) => {
    const [copied, setCopied] = useState(false);

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

    const actionButton = {
        size: "sm" as const,
        variant: "ghost" as const,
        borderRadius: "8px",
        transition: "all 0.2s ease",
        color: { base: "brand.700", _dark: "brand.600" },
        _hover: {
            bg: { base: "brand.50", _dark: "brand.950" },
            color: { base: "brand.800", _dark: "brand.500" },
            transform: "scale(1.05)",
        },
        _active: {
            bg: { base: "brand.100", _dark: "brand.900" },
            color: { base: "brand.800", _dark: "brand.500" },
            transform: "scale(0.95)",
        }
    }


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(msg.content.trimEnd());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toaster.create({
                title: "Failed to copy",
                type: "error",
                description: String(err),
                duration: 2000,
            });
        }
    };

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
                <IconButton
                    {...actionButton}
                    onClick={handleCopy}
                    aria-label="Copy message"
                    bg={copied ? { base: "brand.100", _dark: "brand.900" } : "transparent"}
                    color={copied ? { base: "brand.800", _dark: "brand.400" } : { base: "brand.700", _dark: "brand.600" }}
                >
                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                </IconButton>
            </HStack>
        </Flex>
    );
};

export default UserRequest;