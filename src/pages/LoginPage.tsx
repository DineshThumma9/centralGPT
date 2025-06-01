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
    Separator, Stack,
    Alert
} from '@chakra-ui/react';
import {toaster} from "../components/ui/toaster.tsx";
import React, {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";
import {useColorModeValue} from "../components/ui/color-mode.tsx";
import {Fade} from '@chakra-ui/transition';
import {keyframes} from "@emotion/react";
import {z} from "zod/v4";



const loginSchema = z.object({
    "username":z.string(),
    "password":z.string()
})


const shake = keyframes`
    10%, 90% {
        transform: translateX(-1px);
    }
    20%, 80% {
        transform: translateX(2px);
    }
    30%, 50%, 70% {
        transform: translateX(-4px);
    }
    40%, 60% {
        transform: translateX(4px);
    }
`;

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isError, setError] = useState("")
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({})


    const [usernameTouched, setUsernameTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);



    const [usernameShakeKey, setUsernameShakeKey] = useState(0);
    const [passwordShakeKey, setPasswordShakeKey] = useState(0)



    const {login} = useAuth();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.800");

    const onSubmit = async () => {
        setUsernameTouched(true);
        setPasswordTouched(true);


        setFormErrors({}); // reset errors before validation

        const result = loginSchema.safeParse({
            username,
            password,
        });

        if (!result.success) {
            setFormErrors(result.error.flatten().fieldErrors);
            setUsernameShakeKey((k) => k + 1);
            setPasswordShakeKey((k) => k + 1);
            return; // prevent submitting if invalid
        }

        setIsLoading(true);

        try {
            await login(username,password);
            toaster.create({
                title: "Success",
                description: "Registration successful! You are now logged in.",
                type: "success",
                duration: 3000,
            });
            setFadeOut(true);
            setTimeout(() => navigate("/app"), 300);
        } catch (error) {
            setError(error as string);
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

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };


    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };


    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            p={{base: 4, md: 8}}
            background={"black"}
        >
            <Fade in={!fadeOut} unmountOnExit transition={{exit: {duration: 0.3}}}>
                <Card.Root


                    w="full"
                    bg={cardBg}
                    boxShadow="lg"
                    borderRadius="xl"
                    p={6}
                >
                    <CardHeader width={"sm"}>
                        <Heading as="h1" size="lg" textAlign="center">
                            Sign Up for Free
                        </Heading>
                    </CardHeader>

                    <CardBody width={"sm"}>

                        <Stack p={2}>
                            <Field.Root invalid={Boolean(formErrors.username) && usernameTouched}>
                                <FieldLabel as={"h2"} fontStyle={"bold"} fontSize={"md"}>Username</FieldLabel>
                                <Input
                                    value={username}
                                    onChange={onUsernameChange}
                                    onBlur={() => setUsernameTouched(true)}
                                    animation={formErrors.username && usernameTouched ? `${shake} 0.3s` : undefined}
                                    key={usernameShakeKey} // change key to retrigger animation
                                    placeholder="Enter Username"
                                />
                                {formErrors.username && usernameTouched && (
                                    <Field.ErrorText>{formErrors.username[0]}</Field.ErrorText>
                                )}

                            </Field.Root>
                       \
                            <Field.Root invalid={Boolean(formErrors.password) && passwordTouched}>
                                <FieldLabel>Password</FieldLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={onPasswordChange}
                                    onBlur={() => setPasswordTouched(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") onSubmit();
                                    }}
                                    animation={formErrors.password && passwordTouched ? `${shake} 0.3s` : undefined}
                                    key={passwordShakeKey} // retrigger animation on each failed submit
                                    placeholder="*********"
                                />
                                {formErrors.password && passwordTouched && (
                                    <Field.ErrorText>{formErrors.password[0]}</Field.ErrorText>
                                )}
                            </Field.Root>

                        </Stack>

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
                                onClick={() => onSubmit()}
                                loading={isLoading}
                                loadingText="Registering"
                                fontStyle={"bold"}
                                fontSize={"sm"}
                            >
                                Submit
                            </Button>

                            <Separator/>

                            <Link to="/signup">
                                <Button
                                    bg={"black"}
                                    color="white"
                                    variant="outline"
                                    type="button"
                                    width="100%"
                                    transition="smooth"
                                    fontStyle={"bold"}
                                    fontSize={"md"}
                                >
                                    Dont Have An Account SignUp
                                </Button>
                            </Link>
                        </ButtonGroup>
                    </CardFooter>
                </Card.Root>

            </Fade>
        </Flex>
    );
};

export default LoginPage;
