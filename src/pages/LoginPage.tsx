import {Flex} from '@chakra-ui/react';
import {toaster} from "../components/ui/toaster.tsx";
import React, {useState} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {useColorModeValue} from "../components/ui/color-mode.tsx";
import {Fade} from '@chakra-ui/transition';
import {z} from "zod/v4";
import useFieldForm from "../hooks/useFieldForm.ts";
import InputField from "../components/InputField.tsx";
import CrediantialCard from "../components/CrediantialCard.tsx";


const loginSchema = z.object({
    "username": z.string(),
    "password": z.string()
})

const LoginPage = () => {
    const username = useFieldForm("username");
    const password = useFieldForm("password");

    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const values = {
        username: username.value,
        password: password.value,
    };

    const {login} = useAuth();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.800");

    const onSubmit = async () => {
        const result = loginSchema.safeParse(values);

        if (!result.success) {
            const {fieldErrors} = z.flattenError(result.error);

            if (fieldErrors.username) {
                username.setError(fieldErrors.username[0]);
                username.incrementShakey();
            }

            if (fieldErrors.password) {
                password.setError(fieldErrors.password[0]);
                password.incrementShakey();
            }

            return;
        }

        setIsLoading(true);

        try {
            await login(values.username, values.password);
            toaster.create({
                title: "Success",
                description: "Login successful!",
                type: "success",
                duration: 3000,
            });
            setFadeOut(true);
            setTimeout(() => navigate("/app"), 300);
        } catch (error) {
            console.error("Login error:", error);
            toaster.create({
                title: "Login Failed",
                description: "Please check your credentials and try again.",
                type: "error",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" p={{base: 4, md: 8}} background="black">
            <Fade in={!fadeOut} unmountOnExit transition={{exit: {duration: 0.3}}}>
                <CrediantialCard
                    heading={"Login"}
                    login_register={"login"}
                    message={"Don't have and account? SignUp"}
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    altlink={"/signup"}>


                    <InputField
                        label="Username"
                        placeholder="Enter Your Username"
                        {...username}
                        error={username.error ?? ""} // 👈 fix here
                    />

                    <InputField
                        label="Password"
                        placeholder="Enter Your Password"
                        {...password}
                        error={password.error ?? ""}
                    />


                </CrediantialCard>
            </Fade>
        </Flex>
    );
};

export default LoginPage;
