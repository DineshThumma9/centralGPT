import {Card, CardBody, CardFooter, CardHeader, Heading, Stack} from "@chakra-ui/react";
import {type ReactNode} from "react";
import NavGateButton from "./NavGateButton.tsx";

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
    return (
        <Card.Root
            w="400px"
            maxW="lg"
            bg="rgba(26, 11, 46, 0.95)"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="rgba(147, 51, 234, 0.3)"
            boxShadow="0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.1)"
            borderRadius="xl"
            zIndex={10}
            p={6}
            color="white"
            css={{
                background: 'linear-gradient(135deg, rgba(26, 11, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 52, 96, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
            }}
        >
            <CardHeader>
                <Heading
                    as="h1"
                    size="lg"
                    textAlign="center"
                    color="white"
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
                    <Stack gap={2}>
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