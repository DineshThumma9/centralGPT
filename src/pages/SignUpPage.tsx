import {Flex} from '@chakra-ui/react';
import {toaster} from "../components/ui/toaster.tsx";
import React, {useState, useEffect} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
// Removed useColorModeValue import as it's not needed for Chakra v3
import {Fade} from '@chakra-ui/transition';
import {z} from "zod/v4";
import useFieldForm from '../hooks/useFieldForm.ts';
import InputField from "../components/InputField.tsx";
import CrediantialCard from "../components/CrediantialCard.tsx";
import useValidationStore from "../store/validationStore.ts";
import useInitStore from "../store/initStore.ts";

const signUp = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Fixed: changed from confirm_password
});

const SignUpPage = () => {
    const { clearAllFields } = useValidationStore();
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [, setError] = useState("")

    const username = useFieldForm("username")
    const password = useFieldForm("password")
    const confirmPassword = useFieldForm("confirmPassword") // Fixed: consistent naming
    const email = useFieldForm("email")

    const {register} = useAuth();
    const navigate = useNavigate();
    // Removed cardBg variable as it's not needed
    const {setUsername,setEmail} = useInitStore();

    // Clear fields on component mount
    useEffect(() => {
        clearAllFields();
    }, [clearAllFields]);

    const onSubmit = async () => {

        // Fixed: Pass values instead of field objects
        const values = {
            username: String(username.value || ""),
            email: String(email.value || ""),
            password: String(password.value || ""),
            confirmPassword: String(confirmPassword.value || ""),
        };

        const result = signUp.safeParse(values);

        if (!result.success) {
            const {fieldErrors} = z.flattenError(result.error);

            // Use setTimeout to ensure state updates don't conflict
            setTimeout(() => {
                if (fieldErrors.username) {
                    username.setError(fieldErrors.username[0]);
                    username.incrementShakey();
                }
                if (fieldErrors.email) {
                    email.setError(fieldErrors.email[0]);
                    email.incrementShakey();
                }
                if (fieldErrors.password) {
                    password.setError(fieldErrors.password[0]);
                    password.incrementShakey();
                }
                if (fieldErrors.confirmPassword) {
                    confirmPassword.setError(fieldErrors.confirmPassword[0]);
                    confirmPassword.incrementShakey();
                }
            }, 50);

            return;
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
            setUsername(values.username)
            setEmail(values.email)
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
            minW="100vw"
            align="center"
            justify="center"
            p={{base: 4, md: 8}}
            bg="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"

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
                        label="Username"
                        placeholder="Enter Your Username"
                        value={username.value}
                        onChange={username.onChange}
                        onBlur={username.onBlur}
                        error={username.error ?? ""}
                        touched={username.touched}
                        shakey={username.shakey}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter Your Email"
                        value={email.value}
                        onChange={email.onChange}
                        onBlur={email.onBlur}
                        error={email.error ?? ""}
                        touched={email.touched}
                        shakey={email.shakey}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter Your Password"
                        value={password.value}
                        onChange={password.onChange}
                        onBlur={password.onBlur}
                        error={password.error ?? ""}
                        touched={password.touched}
                        shakey={password.shakey}
                    />
                    <InputField
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        value={confirmPassword.value}
                        onChange={confirmPassword.onChange}
                        onBlur={confirmPassword.onBlur}
                        error={confirmPassword.error ?? ""}
                        touched={confirmPassword.touched}
                        shakey={confirmPassword.shakey}
                    />
                </CrediantialCard>
            </Fade>
        </Flex>
    );
};

export default SignUpPage;