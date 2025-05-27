import {Button, Flex, Heading, Input,Field} from '@chakra-ui/react';
// import {Field} from "../components/ui/field.tsx";
import {toaster} from "../components/ui/toaster.tsx";
import {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";

const SignUpPage = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();



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
            console.log("Input has been read");
            console.log("username: " + username + "  email:" + email + " password: " + password);

            await register(username, email, password);

            toaster.create({
                title: "Success",
                description: "Registration successful! You are now logged in.",
                type: "success",
                duration: 3000,
            });

            // Navigate to chat page after successful registration
            navigate("/app");
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
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={{ base: "gray.100", _dark: "gray.700" }}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Sign Up</Heading>

                <Field.Root mb={6}>
                    <Input
                        placeholder="John Doe"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Field.Root>

                <Field.Root mb={3}>
                    <Input
                        placeholder="johndoe@gmail.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                                onSubmit(username, email, password);
                            }
                        }}
                    />
                </Field.Root>

                <Flex gap={4} mb={8}>
                    <Button
                        colorPalette="teal"
                        loading={isLoading}
                        loadingText="Signing up..."
                        onClick={() => onSubmit(username, email, password)}
                    >
                        Sign Up
                    </Button>
                    <Link to="/login">
                        <Button
                            colorPalette="teal"
                            variant="outline"
                        >
                            Log In
                        </Button>
                    </Link>
                </Flex>

            </Flex>
        </Flex>
    );
};

export default SignUpPage;