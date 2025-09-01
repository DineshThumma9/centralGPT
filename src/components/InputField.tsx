import {Box, Field, FieldErrorText, FieldLabel, Input} from "@chakra-ui/react";
import {css, cx, keyframes} from "@emotion/css";
import {PasswordInput} from "./ui/password-input";

const shake = keyframes`
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
`;

const shakeAnimation = css`
  animation: ${shake} 0.5s ease;
`;

const InputField = ({
                        label,
                        placeholder,
                        value,
                        error,
                        onChange,
                        onBlur,
                        touched,
                        shakey,
                        type = "text",
                    }: {
    label: string;
    placeholder: string;
    value: string;
    error: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    touched: boolean;
    shakey: number;
    type?: string;
}) => {
    const shouldShake = !!(error && touched);
    const isPassword = label.toLowerCase().includes("password");
    const commonProps = {
        className: cx(shouldShake && shakeAnimation),
        type,
        value,
        onChange,
        onBlur,
        placeholder,
        bg: "bg.panel",
        color: "fg.default",
        borderColor: shouldShake ? "red.500" : "border.default",
        borderWidth: "1px",
        _focus: {
            borderColor: shouldShake ? "red.500" : "brand.solid",
            boxShadow: shouldShake ? "0 0 0 2px rgba(239, 68, 68, 0.25)" : "0 0 0 2px rgba(34, 197, 94, 0.25)",
            bg: "bg.surface",
        },
        _placeholder: {
            color: "fg.muted",
            fontWeight: "normal",
        },
        width: "100%",
        fontWeight: "normal",
        fontSize: "md",
        fontFamily: "body",
        key: shakey,
    };

    return (
        <Field.Root width="100%" zIndex={5}>
            <FieldLabel
                color="fg.default"
                fontWeight="500"
                fontSize="sm"
                fontFamily="body"
            >
                {label}
            </FieldLabel>
            <Box w="full">
                {isPassword ? <PasswordInput  {...commonProps} /> : <Input {...commonProps} />}
            </Box>
            {shouldShake && (
                <FieldErrorText
                    color="red.500"
                    fontSize="sm"
                    fontWeight="500"
                    fontFamily="body"
                >
                    {error}
                </FieldErrorText>
            )}
        </Field.Root>
    );
};

export default InputField;
