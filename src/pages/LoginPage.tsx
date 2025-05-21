import {
    Flex,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    Switch,
    useColorMode,
    useColorModeValue, ButtonGroup,
} from '@chakra-ui/react';
import {useAuth} from "../hooks/useAuth.ts";
import {useState} from "react";
import {Link} from "react-router-dom";

const LoginPage = () => {
    const {toggleColorMode} = useColorMode();
    const formBackground = useColorModeValue('gray.100', 'gray.700');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();

    const onSubmit = async (email: string, password: string) => {
        await login(email, password);
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
                <Heading mb={6}>Log In</Heading>
                <Input
                    placeholder="johndoe@gmail.com"
                    type="email"
                    variant="filled"
                    mb={3}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    mb={6}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <ButtonGroup>
                    <Button
                        colorScheme="teal"
                        mb={8}
                        type="submit"
                        onClick={() => onSubmit(email, password)}
                    >
                        Log In
                    </Button>
                    <Link to="/signup">
                        <Button
                            colorScheme="teal"
                            mb={8}
                            type="submit"
                        >
                            SignUp
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

export default LoginPage;