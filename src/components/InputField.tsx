import React from "react";
import {
  Field,
  FieldLabel,
  Input,
} from "@chakra-ui/react";
import { css, keyframes } from "@emotion/react";

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
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
}: {
  label: string;
  placeholder: string;
  value: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  touched: boolean;
  shakey: number;
}) => {
  const animationStyle =
    error && touched
      ? css`
          animation: ${shake} 0.3s ease;
        `
      : undefined;

  return (
    <Field.Root>
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        key={shakey} // re-trigger animation on error
        css={animationStyle}
      />
      {error && touched && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};

export default InputField;
