import {Box, Editable, Flex, HStack, IconButton, type ConditionalValue} from "@chakra-ui/react";
import type {Message} from "../entities/Message.ts";
import {Check, Copy, User} from "lucide-react";
import {LuCheck, LuPencilLine, LuX} from "react-icons/lu";
import {toaster} from "./ui/toaster.tsx";
import {useState} from "react";

interface Props {
    msg: Message;
}


const box = {
    bg: "linear-gradient(135deg, purple.500, violet.500)",
    px: 4,
    py: 3,
    borderRadius: "xl",
    fontSize: "md",
    color: "white",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    boxShadow: "0 2px 12px rgba(147, 51, 234, 0.3)",
    border: "1px solid",
    borderColor: "purple.400"
}



const editableInput = {
    wordBreak: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    bg: "purple.600",
    border: "1px solid",
    borderColor: "purple.400",
    _focus: {
        borderColor: "purple.300",
        boxShadow: "0 0 0 1px rgba(147, 51, 234, 0.3)"
    }
}


const editableIcon = {
    variant: "outline",
    size: "xs" ,
    colorScheme: "purple",
    bg: "white",
    color: "purple.600",
    _hover: {bg: "purple.50"}
}


const actionButton = {

    size: "sm",
    variant: "ghost",
    _hover: {bg: "purple.50"}
}


const UserRequest = ({msg}: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(msg.content.trimEnd());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toaster.create({
                title: "Failed to copy",
                type: "error",
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
            gap={2}
        >
            <Flex
                align="flex-start"
                direction="row"
                gap={3}
                w="100%"
                justify="flex-end"
            >
                {/* Content container - Flexible width with proper constraints */}
                <Box
                    flex="1"
                    maxW="80%"
                    minW={0} // Critical for text wrapping
                >
                    <Box
                        {...box}
                    >
                        <Editable.Root defaultValue={msg.content}>
                            <Editable.Preview
                                wordBreak="break-word"
                                overflowWrap="break-word"
                                whiteSpace="pre-wrap"
                            />
                            <Editable.Input
                                {...editableInput}
                            />

                            <Editable.Control>
                                <Editable.CancelTrigger asChild>
                                    <IconButton
                                        {...editableIcon}
                                    >
                                        <LuX/>
                                    </IconButton>
                                </Editable.CancelTrigger>
                                <Editable.SubmitTrigger asChild>
                                    <IconButton
                                        {...editableIcon}
                                    >
                                        <LuCheck/>
                                    </IconButton>
                                </Editable.SubmitTrigger>
                            </Editable.Control>
                        </Editable.Root>
                    </Box>
                </Box>

                {/* Avatar - Fixed width */}
                <Box flexShrink={0} mt={1}>
                    <Box
                        p={2}
                        bg="linear-gradient(135deg, violet.500, purple.500)"
                        borderRadius="full"
                        boxShadow="0 2px 8px rgba(147, 51, 234, 0.3)"
                    >
                        <User size={16} color="white"/>
                    </Box>
                </Box>
            </Flex>

            {/* Action buttons */}
            <HStack gap={2} mr={12}>
                <IconButton
                    {...actionButton}
                    colorScheme={copied ? "purple" : "gray"}
                    onClick={handleCopy}
                >
                    {copied ? <Check color="purple" size={16}/> : <Copy color="gray" size={16}/>}
                </IconButton>

                <IconButton
                    {...actionButton}
                >
                    <LuPencilLine color="gray" size={16}/>
                </IconButton>
            </HStack>
        </Flex>
    );
};

export default UserRequest;