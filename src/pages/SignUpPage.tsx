import {
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Switch,
    useColorMode,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";

const SignUpPage = () => {
    const {toggleColorMode} = useColorMode();
    const formBackground = useColorModeValue('gray.100', 'gray.700');
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {register} = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (username: string, email: string, password: string) => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            console.log("Input has been read");
            console.log("username: " + username + "  email:" + email + " password: " + password);

            await register(username, email, password);

            toast({
                title: "Success",
                description: "Registration successful! You are now logged in.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Navigate to chat page after successful registration
            navigate("/app");
        } catch (error) {
            console.error("Registration error:", error);
            toast({
                title: "Registration Failed",
                description: "Please check your information and try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Sign Up</Heading>
                <Input
                    placeholder="John Doe"
                    type="text"
                    variant="filled"
                    mb={6}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    placeholder="johndoe@gmail.com"
                    type="email"
                    variant="filled"
                    mb={3}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    mb={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onSubmit(username, email, password);
                        }
                    }}
                />
                <ButtonGroup>
                    <Button
                        colorScheme="teal"
                        mb={8}
                        isLoading={isLoading}
                        loadingText="Signing up..."
                        onClick={() => onSubmit(username, email, password)}
                    >
                        Sign Up
                    </Button>
                    <Link to="/login">
                        <Button
                            colorScheme="teal"
                            mb={8}
                            variant="outline"
                        >
                            Log In
                        </Button>
                    </Link>
                </ButtonGroup>

                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="0">
                        Enable Dark Mode?
                    </FormLabel>
                    <Switch
                        id="dark_mode"
                        colorScheme="teal"
                        size="lg"
                        onChange={toggleColorMode}
                    />
                </FormControl>
            </Flex>
        </Flex>
    );
};

export default SignUpPage;