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
import {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {Link} from "react-router-dom";

const SignUpPage = () => {
    const {toggleColorMode} = useColorMode();
    const formBackground = useColorModeValue('gray.100', 'gray.700');

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {register} = useAuth();

    const onSubmit = async (username: string,email:string,password:string) => {
        console.log("Input has been read")
        console.log("usename: " + username + "  email:" + email + " password" +  password)
        await register(username,email,password);
        navigator
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
                    type="username"
                    variant="filled"
                    mb={6}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                    <Button colorScheme="teal" mb={8} onClick={() => onSubmit(username,email,password)}>
                        Sign Up
                    </Button>
                    <Link to="/login">
                        <Button
                            colorScheme="teal"
                            mb={8}
                            type="submit"
                        >
                            Login In
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