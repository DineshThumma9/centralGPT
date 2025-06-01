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


const signUp = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirm_password"],
});


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

const SignUpPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isError, setError] = useState("")
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({})


    const [usernameTouched, setUsernameTouched] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

    // To trigger animation retrigger
    const [usernameShakeKey, setUsernameShakeKey] = useState(0);
    const [emailShakeKey, setEmailShakeKey] = useState(0);
    const [passwordShakeKey, setPasswordShakeKey] = useState(0)
    const [confirmPasswordShakeKey, setConfirmPasswordShakeKey] = useState(0)


    const {register} = useAuth();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.800");

    const onSubmit = async () => {
        setUsernameTouched(true);
        setPasswordTouched(true);
        setEmailTouched(true);
        setConfirmPasswordTouched(true);

        setFormErrors({}); // reset errors before validation

        const result = signUp.safeParse({
            username,
            email,
            password,
            confirm_password: confirmPassword,
        });

        if (!result.success) {
            setFormErrors(result.error.flatten().fieldErrors);
            setUsernameShakeKey((k) => k + 1);
            setEmailShakeKey((k) => k + 1);
            setPasswordShakeKey((k) => k + 1);
            setConfirmPasswordShakeKey((k) => k + 1);
            return; // prevent submitting if invalid
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


    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
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
                            <Field.Root>
                                <FieldLabel as={"h2"} fontStyle={"bold"} fontSize={"md"}>Email address</FieldLabel>
                                <Input
                                    type="email"
                                    placeholder={"Enter Email"}
                                    value={email}
                                    onBlur={() => setEmailTouched(true)}
                                    css={{"--error-color": "red"}}
                                    animation={formErrors.email && emailTouched ? `${shake} 0.3s` : undefined}
                                    key={emailShakeKey}
                                    onChange={onEmailChange}
                                />{
                                formErrors.email && emailTouched &&
                                <Field.ErrorText>{formErrors.email[0]}</Field.ErrorText>
                            }

                            </Field.Root>
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
                            <Field.Root invalid={Boolean(formErrors.confirmPassword) && confirmPasswordTouched}>
                                <FieldLabel>Confirm Password</FieldLabel>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={onConfirmPasswordChange}
                                    onBlur={() => setConfirmPasswordTouched(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") onSubmit();
                                    }}
                                    animation={formErrors.passwordError && confirmPasswordTouched ? `${shake} 0.3s` : undefined}
                                    key={confirmPasswordShakeKey} // retrigger animation on each failed submit
                                    placeholder="*********"
                                />
                                {formErrors.confirmPassword && confirmPasswordTouched && (
                                    <Field.ErrorText>{formErrors.confirmPassword[0]}</Field.ErrorText>
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

                            <Link to="/login">
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
