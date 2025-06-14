import { Box, HStack } from "@chakra-ui/react";



import { css, cx, keyframes } from "@emotion/css";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;



const TypingBubble = () => {
  return (
    <HStack
      gap={1}
      p={3}
      px={4}
      bg="gray.600"
      borderRadius="xl"
      maxW="fit-content"
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          w="6px"
          h="6px"
          bg="white"
          borderRadius="full"
          animation={`${bounce} 1.4s infinite`}
          animationDelay={`${i * 0.2}s`}
        />
      ))}
    </HStack>
  );
};

export default TypingBubble;

