import {Box} from "@chakra-ui/react";
import type  {Message} from "../entities/Message.ts";


interface Props{
    msg:Message
}

const UserRequest = ({msg}:Props) => {
    return (
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
            {msg.content}
        </Box>
    )
}


export default UserRequest