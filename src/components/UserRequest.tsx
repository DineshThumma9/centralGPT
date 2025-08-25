import {Box, Editable, Flex, HStack, IconButton, VStack} from "@chakra-ui/react";
import {type Message} from "../entities/Message.ts";
import {Check, Copy, User} from "lucide-react";
import {LuCheck, LuPencilLine, LuX} from "react-icons/lu";
import {toaster} from "./ui/toaster.tsx";
import {useState} from "react";
import FileDisplayForUserMessage from "./FileDisplayForUserMessage.tsx";
import { useColorMode } from "../contexts/ColorModeContext";
import { colors } from "../theme/styleDefinitions";

interface Props {
    msg: Message;
}

const UserRequest = ({msg}: Props) => {
    const [copied, setCopied] = useState(false);
    const { colors: themeColors } = useColorMode();

    const box = {
        bg: themeColors.text.primary,
        px: 4,
        py: 1,
        borderRadius: "xl",
        fontSize: "md",
        color: themeColors.background.primary,
        lineHeight: "1.6",
        whiteSpace: "pre-wrap" as const,
        wordBreak: "break-word" as const,
        overflowWrap: "break-word" as const,
        boxShadow: `0 2px 12px ${themeColors.background.hover}`,
        border: "2px solid",
        borderColor: themeColors.border.default
    }

    const editableInput = {
        wordBreak: "break-word" as const,
        overflowWrap: "break-word" as const,
        whiteSpace: "pre-wrap" as const,
        bg: themeColors.background.card,
        border: "1px solid",
        borderColor: themeColors.border.default,
        color: themeColors.text.primary,
        _focus: {
            borderColor: themeColors.border.focus,
            boxShadow: `0 0 0 1px ${themeColors.border.focus}`
        }
    }

    const editableIcon = {
        variant: "outline" as const,
        size: "xs" as const,
        bg: themeColors.background.primary,
        color: themeColors.text.primary,
        border: "1px solid",
        borderColor: themeColors.border.default,
        _hover: {
            bg: themeColors.background.hover,
            borderColor: themeColors.border.hover
        }
    }

    const actionButton = {
        size: "sm" as const,
        variant: "ghost" as const,
        _hover: { 
            bg: themeColors.background.hover,
            color: colors.green.dark // Use green accent for hover
        },
        _active: {
            bg: themeColors.background.active,
            color: colors.green.darker // Use darker green for active
        },
        transition: "all 0.2s ease"
    }

    // Debug logging
    console.log('UserRequest received message:', msg);
    console.log('Message files:', msg.files);
    console.log('Files exists:', !!msg.files);
    console.log('Files length:', msg.files?.length);

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
                        <Box {...box}>
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

                {/* Avatar - Fixed width */}
                <Box flexShrink={0} mt={1}>
                    <Box
                        p={2}
                        bg={colors.text.primary}
                        borderRadius="full"
                        boxShadow={`0 2px 8px ${colors.background.hover}`}
                    >
                        <User size={16} color={colors.background.primary}/>
                    </Box>
                </Box>
            </Flex>

            {/* Action buttons */}
            <HStack gap={2} mr={12}>
                <IconButton
                    {...actionButton}
                    bg={copied ? colors.green.light : themeColors.background.card}
                    color={copied ? "white" : themeColors.text.muted}
                    onClick={handleCopy}
                    aria-label="Copy message"
                    _hover={{
                        ...actionButton._hover,
                        bg: copied ? colors.green.dark : themeColors.background.hover,
                        color: copied ? "white" : colors.green.dark
                    }}
                >
                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                </IconButton>

                <IconButton
                    {...actionButton}
                    color={themeColors.text.muted}
                    aria-label="Edit message"
                    _hover={{
                        ...actionButton._hover,
                        color: colors.green.dark
                    }}
                >
                    <LuPencilLine size={16}/>
                </IconButton>
            </HStack>
        </Flex>
    );
};

export default UserRequest;