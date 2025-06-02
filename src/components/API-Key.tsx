"use client";
import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { apiKeySelection } from "../api/session-api.ts";
import useInitStore from "../store/initStore.ts";

interface Props {
  provider: string;
  title: string;
  selected?: string;
}

const APIKey = ({ provider, title }: Props) => {
  const {
    dialogOpen,
    setDialogOpen,
    currentAPIProvider,
    setCurrentAPIKey,
  } = useInitStore();

  const ref = useRef<HTMLInputElement>(null);
  const [apiKey, setAPIKey] = useState("");

  const handleDialogChange = ({ open }: { open: boolean }) =>
    setDialogOpen(open);

  const handleApiKeySelect = async () => {
    await apiKeySelection(currentAPIProvider, apiKey);
    setCurrentAPIKey(apiKey);
    setDialogOpen(false);
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={handleDialogChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title  fontStyle = "bold"  color = "black"  padding = {0}>Enter Your API Key - {provider}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body >
              <Stack >
                <Field.Root>
                  <Field.Label>{title}</Field.Label>
                  <Input
                    ref={ref}
                    placeholder="Enter your API KEY"
                    value={apiKey}
                    onChange={(e) => setAPIKey(e.target.value)}
                  />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleApiKeySelect}>Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default APIKey;
