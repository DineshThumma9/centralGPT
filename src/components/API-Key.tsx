"use client";
import {Button, Dialog, Field, Input, Portal, Stack, useSlotRecipe} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {apiKeySelection} from "../api/session-api.ts";
import useInitStore from "../store/initStore.ts";

interface Props {
    provider: string;
    title: string;
    selected?: string;
    link?: string
}

const APIKey = ({provider, title, link}: Props) => {
    const {
        dialogOpen,
        setDialogOpen,
        currentAPIProvider,
        setCurrentAPIKey,
    } = useInitStore();


    const ref = useRef<HTMLInputElement>(null);
    const [apiKey, setAPIKey] = useState("");


    const recipe = useSlotRecipe({key: "dialogHelper"})
    const styles = recipe()


    const handleDialogChange = ({open}: { open: boolean }) =>
        setDialogOpen(open);

    const handleApiKeySelect = async () => {

        if (currentAPIProvider != null && apiKey != null) {
            setDialogOpen(false);
            await apiKeySelection(currentAPIProvider, apiKey);
            setCurrentAPIKey(apiKey);
        }


    };

    return (
        <Dialog.Root open={dialogOpen} onOpenChange={handleDialogChange}>
            <Portal>
                <Dialog.Backdrop
                    css={styles.backdrop}
                />
                <Dialog.Positioner>
                    <Dialog.Content
                        css={styles.content}
                    >
                        <Dialog.Header p={6} pb={4}>
                            <Dialog.Title
                                css={styles.title}


                            >
                                Enter Your API Key-{provider}
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
                                        css={styles.input}
                                    />
                                </Field.Root>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer p={6} pt={4} gap={3}>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    css={styles.cancel}
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={handleApiKeySelect}
                                css={{
                                    bg: "purple.500",
                                    borderRadius: "10px"
                                }}
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