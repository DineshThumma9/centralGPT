import {Box, Center, Heading, Text, VStack} from "@chakra-ui/react";
import {Bot} from "lucide-react";


const EmptyState = () => {
    return (
              <Center h="full">
                    <VStack gap={6} textAlign="center">
                        <Box p={4} bg="gray.50" borderRadius="full">
                            <Bot size={32} color="#666"/>
                        </Box>
                        <VStack gap={2}>
                            <Heading fontSize="xl" fontWeight="600" color="gray.700">
                                Start a conversation
                            </Heading>
                            <Text fontSize="md" color="gray.500" maxW="400px" lineHeight="1.6">
                                Choose a model and start chatting. Your messages will appear here.
                            </Text>
                        </VStack>
                    </VStack>
                </Center>
    )
}

export default EmptyState;