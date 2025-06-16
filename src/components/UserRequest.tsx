import {Box, HStack, IconButton, Editable, VStack} from "@chakra-ui/react";
import type {Message} from "../entities/Message.ts";
import {Copy, Trash} from "lucide-react";
import {LuCheck, LuPencilLine, LuX} from "react-icons/lu";
import {toaster} from "./ui/toaster.tsx";
import {useState} from "react";

interface Props {
    msg: Message;
}

const UserRequest = ({msg}: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(msg.content.trimEnd());
            setCopied(true);
            toaster.create({
                title: "Copied to clipboard",
                type: "success",
                duration: 2000,
            });
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
        <VStack  >

        <Box
            bg="gray.700"
            px={4}
            py={3}
            borderRadius="lg"
            fontSize="md"
            color="white"
            lineHeight="1.6"
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            maxW="80%"
        >
            <Editable.Root defaultValue={msg.content}>
                <Editable.Preview />
                <Editable.Input />

                <Editable.Control>
                    <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs">
                            <LuX />
                        </IconButton>
                    </Editable.CancelTrigger>
                    <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs">
                            <LuCheck />
                        </IconButton>
                    </Editable.SubmitTrigger>
                </Editable.Control>

            </Editable.Root>
        </Box>

            <HStack mt={1}
                    alignSelf = "flex-end"
                    p={0}
                    m={0}>
                    <IconButton
                        aria-label="Copy"
                        size="sm"
                        variant="ghost"
                        colorScheme={copied ? "green" : "gray"}
                        onClick={handleCopy}
                        p={0}
                        m={0}
                    >
                        <Copy size={8} />
                    </IconButton>



                    <IconButton
                        aria-label="Delete"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            toaster.create({
                                title: "Delete not implemented",
                                type: "warning",
                                duration: 1500,
                            })
                        }
                         p={0}
                        m={0}
                    >
                      <LuPencilLine size={8}/>
                    </IconButton>
                </HStack>
            </VStack>

    );
};

export default UserRequest;
