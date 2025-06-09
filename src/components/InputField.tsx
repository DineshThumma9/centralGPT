import { Input, Box, Field, FieldLabel, FieldErrorText } from "@chakra-ui/react";
import { css, cx, keyframes } from "@emotion/css";
import { PasswordInput } from "./ui/password-input";

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
    borderColor: shouldShake ? "red.500" : "gray.300",
    borderWidth: "1px",
    _focus: { borderColor: shouldShake ? "red.500" : "blue.500" },
    width: "100%",
    key: shakey,
  };

  return (
    <Field.Root width="100%" zIndex={5}>
      <FieldLabel>{label}</FieldLabel>
      <Box w="full">
        {isPassword ? <PasswordInput {...commonProps} /> : <Input {...commonProps} />}
      </Box>
      {shouldShake && (
        <FieldErrorText color="red.500" fontSize="sm">
          {error}
        </FieldErrorText>
      )}
    </Field.Root>
  );
};

export default InputField;
