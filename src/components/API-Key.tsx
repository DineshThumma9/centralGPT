"use client";
import {Button, Dialog, Field, Input, Portal, Stack} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {apiKeySelection} from "../api/session-api.ts";
import useInitStore from "../store/initStore.ts";

interface Props {
    provider: string;
    title: string;
    selected?: string;
}


const dialogContent = {
    bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 100%)",
    borderRadius: "20px",
    border: "1px solid rgba(139, 69, 197, 0.2)",
    boxShadow: "0 20px 60px rgba(139, 69, 197, 0.3)",
    backdropFilter: "blur(20px)",
    maxW: "md",
    mx: 4
}


const dialogTitle = {
    fontSize: "xl",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    bg: "linear-gradient(135deg, #8b45c5 0%, #06b6d4 100%)",
    bgClip: "text",
    css: {
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
    }
}


const dialogInput = {
    bg: "rgba(26, 10, 46, 0.6)",
    border: "1px solid rgba(139, 69, 197, 0.3)",
    borderRadius: "12px",
    color: "white",
    px: 4,
    py: 3,
    fontSize: "sm",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    _placeholder: {
        color: "rgba(255, 255, 255, 0.5)"
    },
    _focus: {
        borderColor: "#8b45c5",
        boxShadow: "0 0 0 3px rgba(139, 69, 197, 0.2)",
        bg: "rgba(26, 10, 46, 0.8)"
    },
    _hover: {
        borderColor: "rgba(139, 69, 197, 0.5)",
        bg: "rgba(26, 10, 46, 0.7)"
    }
}


const dialogButtonCancel = {
    variant: "outline",
    borderRadius: "12px",
    border: "1px solid rgba(139, 69, 197, 0.3)",
    color: "rgba(255, 255, 255, 0.8)",
    bg: "transparent",
    px: 6,
    py: 2,
    _hover: {
        bg: "rgba(139, 69, 197, 0.1)",
        borderColor: "rgba(139, 69, 197, 0.5)",
        color: "white"
    },
    _active: {
        transform: "translateY(1px)"
    },
    transition: "all 0.2s"
}

const dialogButtonSave = {
    bg: "linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)",
    color: "white",
    borderRadius: "12px",
    px: 6,
    py: 2,
    fontWeight: "medium",
    border: "none",
    _hover: {
        bg: "linear-gradient(135deg, #9f4fd9 0%, #7c3aed 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 8px 25px rgba(139, 69, 197, 0.4)"
    },
    _active: {
        transform: "translateY(1px)"
    },
    transition: "all 0.2s"
}




const APIKey = ({provider, title}: Props) => {
    const {
        dialogOpen,
        setDialogOpen,
        currentAPIProvider,
        setCurrentAPIKey,
    } = useInitStore();

    const ref = useRef<HTMLInputElement>(null);
    const [apiKey, setAPIKey] = useState("");

    const handleDialogChange = ({open}: { open: boolean }) =>
        setDialogOpen(open);

    const handleApiKeySelect = async () => {
        await apiKeySelection(currentAPIProvider, apiKey);
        setCurrentAPIKey(apiKey);
        setDialogOpen(false);
    };

    return (
        <Dialog.Root open={dialogOpen} onOpenChange={handleDialogChange}>
            <Portal>
                <Dialog.Backdrop
                    bg="rgba(10, 10, 15, 0.8)"
                    backdropFilter="blur(20px)"
                />
                <Dialog.Positioner>
                    <Dialog.Content
                        {...dialogContent}
                    >
                        <Dialog.Header p={6} pb={4}>
                            <Dialog.Title
                                {...dialogTitle}

                            >
                                Enter Your API Key - {provider}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body p={6} pt={2}>
                            <Stack gap={4}>
                                <Field.Root>
                                    <Field.Label
                                        color="rgba(255, 255, 255, 0.9)"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        mb={2}
                                    >
                                        {title}
                                    </Field.Label>
                                    <Input
                                        ref={ref}
                                        placeholder="Enter your API KEY"
                                        value={apiKey}
                                        onChange={(e) => setAPIKey(e.target.value)}
                                        {...dialogInput}
                                    />
                                </Field.Root>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer p={6} pt={4} gap={3}>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    {...dialogButtonCancel}
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={handleApiKeySelect}
                                {...dialogButtonSave}
                            >
                                Save
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default APIKey;