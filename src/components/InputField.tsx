import { Input, Box, Field, FieldLabel, FieldErrorText } from "@chakra-ui/react";
import { css, cx, keyframes } from "@emotion/css";
import { PasswordInput } from "./ui/password-input";
import useTheme from "../hooks/useTheme";
import { useColorMode } from "../contexts/ColorModeContext";

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
  const { themeColors } = useTheme();
  const { colorMode } = useColorMode();
  const shouldShake = !!(error && touched);
  const isPassword = label.toLowerCase().includes("password");
  const commonProps = {
    className: cx(shouldShake && shakeAnimation),
    type,
    value,
    onChange,
    onBlur,
    placeholder,
    bg: colorMode === 'light' ? "rgba(255, 255, 255, 0.98)" : themeColors.background.card,
    color: themeColors.text.primary,
    borderColor: shouldShake ? themeColors.status.error : themeColors.border.default,
    borderWidth: "2px", // Thicker border for better definition
    _focus: { 
      borderColor: shouldShake ? themeColors.status.error : themeColors.green.dark,
      boxShadow: `0 0 0 2px ${shouldShake ? themeColors.status.error : themeColors.green.dark}40`,
      bg: colorMode === 'light' ? "rgba(255, 255, 255, 1)" : themeColors.background.card,
    },
    _placeholder: {
      color: colorMode === 'light' ? "#6b7280" : themeColors.text.muted,
      fontWeight: colorMode === 'light' ? "600" : "normal", // Much bolder placeholder in light mode
    },
    width: "100%",
    fontWeight: colorMode === 'light' ? "600" : "normal", // Much bolder text in light mode
    fontSize: colorMode === 'light' ? "md" : "sm", // Larger font in light mode
    key: shakey,
  };

  return (
    <Field.Root width="100%" zIndex={5}>
      <FieldLabel 
        color={themeColors.text.primary}
        fontWeight={colorMode === 'light' ? "700" : "500"} // Much bolder labels in light mode
        fontSize={colorMode === 'light' ? "md" : "sm"} // Larger font in light mode
      >
        {label}
      </FieldLabel>
      <Box w="full">
        {isPassword ? <PasswordInput  {...commonProps} /> : <Input {...commonProps} />}
      </Box>
      {shouldShake && (
        <FieldErrorText 
          color={themeColors.status.error} 
          fontSize="sm"
          fontWeight={colorMode === 'light' ? "600" : "500"} // Bolder error text in light mode
        >
          {error}
        </FieldErrorText>
      )}
    </Field.Root>
  );
};

export default InputField;
