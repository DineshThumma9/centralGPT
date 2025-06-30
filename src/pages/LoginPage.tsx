import {Flex} from '@chakra-ui/react';
import {toaster} from "../components/ui/toaster.tsx";
import  {useState, useEffect} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
// Removed useColorModeValue import as it's not needed for Chakra v3
import {Fade} from '@chakra-ui/transition';
import {z} from "zod/v4";
import useFieldForm from "../hooks/useFieldForm.ts";
import InputField from "../components/InputField.tsx";
import CrediantialCard from "../components/CrediantialCard.tsx";
import useValidationStore from "../store/validationStore.ts";
import useInitStore from "../store/initStore.ts";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
});

const LoginPage = () => {
    const { clearAllFields } = useValidationStore();
    const username = useFieldForm("username");
    const password = useFieldForm("password");

    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();
    // Removed cardBg variable as it's not needed
    const {setUsername}=useInitStore()

    // Clear fields on component mount
    useEffect(() => {
        clearAllFields();
    }, [clearAllFields]);

    const onSubmit = async () => {
        const values = {
            username: username.value,
            password: password.value,
        };

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
            setUsername(values.username)
            setFadeOut(true);
            setTimeout(() => navigate("/app"), 300);
        } catch (error) {
            console.error("Login error:", error);

            // Clear previous errors first
            username.setError("");
            password.setError("");

            // Set field errors for visual feedback
            setTimeout(() => {
                username.setError("Invalid credentials");
                password.setError("Invalid credentials");
                username.incrementShakey();
                password.incrementShakey();
            }, 50);

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
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            p={{base: 4, md: 8}}
            bg="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"
        >
            <Fade in={!fadeOut} unmountOnExit transition={{exit: {duration: 0.3}}}>
                <CrediantialCard
                    heading={"Login"}
                    login_register={"Login"}
                    message={"Don't have an account? Sign Up"}
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    altlink={"/signup"}
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
                        label="Password"
                        placeholder="Enter Your Password"
                        value={password.value}
                        onChange={password.onChange}
                        onBlur={password.onBlur}
                        error={password.error ?? ""}
                        touched={password.touched}
                        shakey={password.shakey}
                    />
                </CrediantialCard>
            </Fade>
        </Flex>
    );
};

export default LoginPage;