import {
    Button,
    Flex,
    Heading,
    Input,
    Field,
    Card,
    CardHeader,
    CardBody,
    FieldLabel,
    CardFooter,
    ButtonGroup,
    Separator
} from '@chakra-ui/react';
import { toaster } from "../components/ui/toaster.tsx";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useColorModeValue } from "../components/ui/color-mode.tsx";
import { Fade } from '@chakra-ui/transition';

const SignUpPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.800");

    const onSubmit = async (username: string, email: string, password: string) => {
        if (!username.trim() || !email.trim() || !password.trim()) {
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
            await register(username, email, password);

            toaster.create({
                title: "Success",
                description: "Registration successful! You are now logged in.",
                type: "success",
                duration: 3000,
            });

            setFadeOut(true);
            setTimeout(() => navigate("/app"), 300); // match fade duration
        } catch (error) {
            console.error("Registration error:", error);
            toaster.create({
                title: "Registration Failed",
                description: "Please check your information and try again",
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
                                type="password"
                                placeholder={"*********"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit(username, email, password);
                                    }
                                }}
                            />

                            <FieldLabel>Email address</FieldLabel>
                            <Input
                                type="email"
                                placeholder={"Enter Email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field.Root>
                    </CardBody>

                    <CardFooter>
                        <ButtonGroup
                            alignSelf="start"
                            alignContent="center"
                            flexDirection="column"
                            alignItems="stretch"
                            gap={2}
                            width="100%"
                        >
                            <Button
                                colorScheme="blue"
                                type="submit"
                                width="100%"
                                onClick={() => onSubmit(username, email, password)}
                                loading={isLoading}
                                loadingText="Registering"
                            >
                                Submit
                            </Button>

                            <Separator />

                            <Link to="/login">
                                <Button
                                    colorScheme="blue"
                                    variant="outline"
                                    type="button"
                                    width="100%"
                                    transition="smooth"
                                >
                                    Already Have an Account? Log In
                                </Button>
                            </Link>
                        </ButtonGroup>
                    </CardFooter>
                </Card.Root>
            </Fade>
        </Flex>
    );
};

export default SignUpPage;
