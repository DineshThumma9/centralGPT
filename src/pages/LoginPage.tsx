import {
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input, Spinner,
    Switch,
    useColorMode,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import {useAuth} from "../hooks/useAuth.ts";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const LoginPage = () => {
    const {toggleColorMode} = useColorMode();
    const formBackground = useColorModeValue('gray.100', 'gray.700');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (username: string, password: string) => {
        if (!username.trim() || !password.trim()) {
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

            console.log("Attempting login with:", username, password);
            await login(username, password);

            toast({
                title: "Success",
                description: "Login successful!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            navigate("/app");
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Login Failed",
                description: "Invalid username or password",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>

        {isLoading && <Spinner/>}


        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Log In</Heading>
                <Input
                    placeholder="Username"
                    type="text"
                    variant="filled"
                    mb={3}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                            onSubmit(username, password);
                        }
                    }}
                />

                <ButtonGroup>
                    <Button
                        colorScheme="teal"
                        mb={8}
                        type="submit"
                        isLoading={isLoading}
                        loadingText="Logging in..."
                        onClick={() => onSubmit(username, password)}
                    >
                        Log In
                    </Button>
                    <Link to="/signup">
                        <Button
                            colorScheme="teal"
                            mb={8}
                            variant="outline"
                        >
                            Sign Up
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
            </>
    );


};

export default LoginPage;