// src/pages/AuthPageLayout.tsx
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { ColorModeToggle } from "../components/ColorModeToggle";

interface AuthPageLayoutProps {
  children: ReactNode;
  title: string;
  illustration: string;
}

const AuthPageLayout = ({ children, title, illustration }: AuthPageLayoutProps) => {
  return (
    <Flex minH="100vh" w="100vw">
      {/* Left Side - Illustration */}
      <Box
        flex="1"
        bg="bg.panel"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        p={10}
        position="relative"
      >
        <Box position="absolute" top={4} right={4}>
          <ColorModeToggle />
        </Box>
        <Flex direction="column" align="center" justify="center" textAlign="center">
          <Image src={illustration} alt={title} maxW="80%" mb={8} />
          <Text fontSize="3xl" fontWeight="bold" color="fg">
            {title}
          </Text>
          <Text fontSize="lg" color="fg.muted" mt={2}>
            Your intelligent coding assistant
          </Text>
        </Flex>
      </Box>

      {/* Right Side - Form */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        p={{ base: 4, md: 8 }}
        bg="bg"
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default AuthPageLayout;
