import { Box, HStack, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`;

const ThinkingIndicator = () => {
  return (
    <HStack gap={1} alignItems="center" py={2}>
      <Text fontSize="sm" color="fg.muted">
        AI is thinking
      </Text>
      <HStack gap={1} ml={1}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            w="3px"
            h="3px"
            bg="brand.500"
            borderRadius="full"
            animation={`${bounce} 1.4s infinite ease-in-out`}
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </HStack>
    </HStack>
  );
};

export default ThinkingIndicator;
