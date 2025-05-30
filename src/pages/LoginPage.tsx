import {
    Button,
    Flex,
    Heading,
    Input,
    Spinner,
    Field,
    Card,
    CardHeader,
    CardBody,
    FieldLabel,
    CardFooter,
    ButtonGroup,
    Separator,
    useDisclosure,
} from '@chakra-ui/react';
import { toaster } from "../components/ui/toaster";
import { useAuth } from "../hooks/useAuth.ts";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useColorModeValue } from "../components/ui/color-mode.tsx";
import { Fade, SlideFade } from "@chakra-ui/transition";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.800");
    const { isOpen, onToggle } = useDisclosure();

    const onSubmit = async (username: string, password: string) => {
        if (!username.trim() || !password.trim()) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        try {
            await login(username, password);

            toaster.create({
                title: "Success",
                description: "Login successful!",
                type: "success",
                duration: 3000,
            });

            setFadeOut(true);
            setTimeout(() => navigate("/app"), 300); // delay for fade
        } catch (error) {
            toaster.create({
                title: "Login Failed",
                description: "Invalid username or password",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            p={{ base: 4, md: 8 }}
            background={"black"}
        >
            <Fade in={!fadeOut} unmountOnExit transition={{ exit: { duration: 0.3 } }}>
                <Card.Root
                    maxW="sm"
                    w="full"
                    bg={cardBg}
                    boxShadow="lg"
                    borderRadius="xl"
                    p={6}
                >
                    <CardHeader>
                        <Heading as="h2" size="lg" textAlign="center">
                            Sign Up for Free
                        </Heading>
                    </CardHeader>

                    <CardBody>
                        <Field.Root>
                            <FieldLabel>Username</FieldLabel>
                            <Input
                                type="text"
                                placeholder={"Enter Username"}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <FieldLabel>Password</FieldLabel>
                            <Input
                                type={"password"}
                                placeholder={"*********"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        onSubmit(username, password);
                                    }
                                }}
                            />
                        </Field.Root>
                    </CardBody>

                    <CardFooter>
                        <ButtonGroup
                            alignContent={"center"}
                            alignSelf="start"
                            flexDirection="column"
                            alignItems="stretch"
                            gap={2}
                            width="100%"
                        >
                            {/*<SlideFade in={isOpen}>*/}
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                    width="full"
                                    onClick={() => {
                                        onSubmit(username, password);
                                        onToggle();
                                    }}
                                    loading={isLoading}
                                    loadingText="Logging in"
                                >
                                    Submit
                                </Button>
                            {/*</SlideFade>*/}
                            <Separator />
                            {/*<Fade in={isOpen}>*/}
                                <Link to="/signup">
                                    <Button
                                        colorScheme={"purple"}
                                        type={"button"}
                                        width={"full"}
                                        transition={"smooth"}
                                    >
                                        Don't Have an account? Sign Up
                                    </Button>
                                </Link>
                            {/*</Fade>*/}
                        </ButtonGroup>
                    </CardFooter>
                </Card.Root>
            </Fade>
        </Flex>
    );
};

export default LoginPage;
