import {Box, Center, Heading, Text, VStack} from "@chakra-ui/react";
import {Bot} from "lucide-react";
import { useColorMode } from "../contexts/ColorModeContext";


const EmptyState = () => {
    const { colors } = useColorMode();
    
    return (
              <Center h="full">
                    <VStack gap={6} textAlign="center">
                        <Box p={4} bg={colors.background.muted} borderRadius="full">
                            <Bot size={32} color={colors.text.secondary}/>
                        </Box>
                        <VStack gap={2}>
                            <Heading fontSize="xl" fontWeight="600" color={colors.text.primary}>
                                Start a conversation
                            </Heading>
                            <Text fontSize="md" color={colors.text.secondary} maxW="400px" lineHeight="1.6">
                                Choose a model and start chatting. Your messages will appear here.
                            </Text>
                        </VStack>
                    </VStack>
                </Center>
    )
}

export default EmptyState;