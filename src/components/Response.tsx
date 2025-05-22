import {Box, Text, VStack} from "@chakra-ui/react";
import type {Message} from "./ChatArea.tsx";


const Response = () => {

    const messages:Message[] = []

    return (


            <Box flex="1" w="full" p={4} overflowY="auto" bg="gray.50">
                <VStack spacing={3} align="stretch">
                    {messages.map((msg, idx) => (
                        <Box
                            key={idx}
                            alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                            bg={msg.role === "user" ? "blue.500" : "gray.50"}
                            color={msg.role === "user" ? "white" : "black"}
                            px={4}
                            py={2}
                            borderRadius="md"
                            maxW="75%"
                        >
                            <Text>{msg.content}</Text>
                        </Box>
                    ))}
                </VStack>
            </Box>
    )
}

export default Response;
