import {Card, CardBody, CardFooter, CardHeader, Heading, Stack} from "@chakra-ui/react";
import {type ReactNode} from "react";
import NavGateButton from "./NavGateButton.tsx";
import useTheme from "../hooks/useTheme.ts";
import { useColorMode } from "../contexts/ColorModeContext";

interface Props {
    heading: string,
    children: ReactNode
    login_register: string
    message: string
    isLoading: boolean
    onSubmit: () => void
    altlink: string
}

const CrediantialCard = ({heading, login_register, children, message, isLoading, onSubmit, altlink}: Props) => {
    const { themeColors } = useTheme();
    const { colorMode } = useColorMode();
    
    return (
        <Card.Root
            w="400px"
            maxW="lg"
            bg={colorMode === 'light' ? "rgba(255, 255, 255, 0.98)" : themeColors.background.card}
            backdropFilter={colorMode === 'light' ? "blur(20px)" : "blur(12px)"} // Stronger blur for light mode
            border="2px solid" // Thicker border for better definition
            borderColor={colorMode === 'light' ? "rgba(17, 24, 39, 0.2)" : themeColors.border.default}
            boxShadow={colorMode === 'light' ? 
                `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9)` : 
                `0 8px 32px 0 ${themeColors.shadow.lg}`
            }
            borderRadius="xl"
            zIndex={10}
            p={6}
            color={themeColors.text.primary}
            style={colorMode === 'light' ? {
                background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.98) 0%, 
                    rgba(248, 250, 252, 0.95) 100%)`
            } : undefined}
        >
            <CardHeader>
                <Heading
                    as="h1"
                    size="lg"
                    textAlign="center"
                    color={themeColors.text.primary}
                    fontWeight="bold"
                    mb={2}
                >
                    {heading}
                </Heading>
            </CardHeader>

            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}>
                <CardBody>
                    <Stack gap={4}>
                        {children}
                    </Stack>
                </CardBody>

                <CardFooter>
                    <NavGateButton
                        login_register={login_register}
                        message={message}
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        altlink={altlink}
                    />
                </CardFooter>
            </form>
        </Card.Root>
    )
}

export default CrediantialCard;