import {Flex} from '@chakra-ui/react';
import {toaster} from "../components/ui/toaster.tsx";
import React, {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {useColorModeValue} from "../components/ui/color-mode.tsx";
import {Fade} from '@chakra-ui/transition';
import {z} from "zod/v4";
import useFieldForm from '../hooks/useFieldForm.ts';
import InputField from "../components/InputField.tsx";
import CrediantialCard from "../components/CrediantialCard.tsx";


const signUp = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirm_password"],
});


const SignUpPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [isError, setError] = useState("")
    const username = useFieldForm("username")
    const password = useFieldForm("password")
    const confirmPassword = useFieldForm("confirmpassword")
    const email = useFieldForm("email")


    const {register} = useAuth();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.800");

    const onSubmit = async () => {


        const result = signUp.safeParse({
            username,
            email,
            password,
            confirm_password: confirmPassword,
        });

        if (!result.success) {
            const {fieldErrors} = z.flattenError(result.error)
            if (fieldErrors.username) {
                username.setError(fieldErrors.username[0])
                username.incrementShakey()
            }
            if (fieldErrors.email) {
                email.setError(fieldErrors.email[0])
                email.incrementShakey()
            }
            if (fieldErrors.password) {
                password.setError(fieldErrors.password[0])
                password.incrementShakey()
            }
            if (fieldErrors.confirmPassword) {
                confirmPassword.setError(fieldErrors.confirmPassword[0])
                confirmPassword.incrementShakey()

            }

            return; // prevent submitting if invalid
        }

        setIsLoading(true);

        try {
            await register(username.value, email.value, password.value);
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


    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            p={{base: 4, md: 8}}
            background={"black"}
        >
            <Fade in={!fadeOut} unmountOnExit transition={{exit: {duration: 0.3}}}>


                <CrediantialCard
                    heading={"Sign Up"}
                    login_register={"register"}
                    message={"Already Have an Account? Login in Here"}
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    altlink={"/login"}
                >
                    <InputField
                        label="username"
                        placeholder={"Enter Your Username"}
                        {...username}
                        error={username.error ?? ""}
                    />
                    <InputField
                        label={"email"}
                        placeholder={"Enter Your Email"}
                        {...email}
                        error={email.error ?? ""}
                    />
                    <InputField
                        label={"password"}
                        placeholder={"Enter Your Password"}
                        {...password}
                        error={password.error ?? ""}
                    />
                    <InputField
                        label={"confirm password"}
                        placeholder={"Confirm Password"}
                        {...confirmPassword}
                        error={confirmPassword.error ?? ""}
                    />
                </CrediantialCard>


            </Fade>
        </Flex>
    );
};

export default SignUpPage;
