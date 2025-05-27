import {Button, Flex, Heading, Input, Spinner,Field} from '@chakra-ui/react';
// import {Field} from "../components/ui/field";
import {toaster} from "../components/ui/toaster";
import {useAuth} from "../hooks/useAuth.ts";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const LoginPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();



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
            console.log("Attempting login with:", username, password);
            await login(username, password);

            toaster.create({
                title: "Success",
                description: "Login successful!",
                type: "success",
                duration: 3000,
            });

            navigate("/app");
        } catch (error) {
            console.error("Login error:", error);
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
        <>
            {isLoading && <Spinner />}

            <Flex h="100vh" alignItems="center" justifyContent="center">
                <Flex
                    flexDirection="column"
                    bg={{ base: "gray.100", _dark: "gray.700" }}
                    p={12}
                    borderRadius={8}
                    boxShadow="lg"
                >
                    <Heading mb={6}>Log In</Heading>

                    <Field.Root mb={3}>
                        <Input
                            placeholder="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Field.Root>

                    <Field.Root mb={6}>
                        <Input
                            placeholder="**********"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    onSubmit(username, password);
                                }
                            }}
                        />
                    </Field.Root>

                    <Flex gap={4} mb={8}>
                        <Button
                            colorPalette="teal"
                            type="submit"
                            loading={isLoading}
                            loadingText="Logging in..."
                            onClick={() => onSubmit(username, password)}
                        >
                            Log In
                        </Button>
                        <Link to="/signup">
                            <Button
                                colorPalette="teal"
                                variant="outline"
                            >
                                Sign Up
                            </Button>
                        </Link>
                    </Flex>


                </Flex>
            </Flex>
        </>
    );
};

export default LoginPage;