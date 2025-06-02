import { create } from "zustand";

export type FieldType = {
  value: string;
  touched: boolean;
  shakey: number;
  error?: string;
};

export type ValidationState = {
  fields: Record<string, FieldType>;

  setFieldValue: (name: string, value: string) => void;
  setFieldTouched: (name: string) => void;
  incrementShakey: (name: string) => void;
  setFieldError: (name: string, error?: string) => void;
};

const useValidationStore = create<ValidationState>((set) => ({
  fields: {},

  setFieldValue: (name, value) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [name]: {
          ...state.fields[name],
          value,
        },
      },
    })),

  setFieldTouched: (name) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [name]: {
          ...state.fields[name],
          touched: true,
        },
      },
    })),

  setFieldError: (name, error) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [name]: {
          ...state.fields[name],
          error,
        },
      },
    })),

  incrementShakey: (name) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [name]: {
          ...state.fields[name],
          shakey: (state.fields[name]?.shakey || 0) + 1,
        },
      },
    })),
}));

export default useValidationStore;
