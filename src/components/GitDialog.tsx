import {Button, Dialog, Field, HStack, Input, InputGroup, Portal, useSlotRecipe, VStack} from "@chakra-ui/react"
import GitCard from "./GitCard.tsx";
import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import useSessionStore from "../store/sessionStore.ts";
import {v3} from "uuid";

interface Props {
    onCancel: () => void;
    onConfirm: () => void;
}


const dialogHeader = {
    p: 6,
    pb: 4
};


const dialogBody = {
    p: 6,
    pt: 2,
    color: "rgba(255, 255, 255, 0.9)"
};

const dialogFooter = {
    p: 6,
    pt: 4,
    gap: 3
};

import { z } from "zod";
import {gitFilesUpload} from "../api/rag-api.ts";

export const GitRequestSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  commit: z.string().optional(),
  branch: z.string().default("main").optional(),
  dir_include: z.array(z.string()).optional(),
  dir_exclude: z.array(z.string()).optional(),
  file_extension_include: z.array(z.string()).optional(),
  file_extension_exclude: z.array(z.string()).optional(),
});

export type GitRequestSchema = z.infer<typeof GitRequestSchema>


const GitDialog = ({onConfirm, onCancel}: Props) => {


   const [owner,setOwner]=useState("")
    const [repo,setRepo] = useState("")
    const [branch,setBranch] = useState("")
    const [commit,setCommit] = useState("")
   const {current_session,context_id} = useSessionStore()

    const recipe = useSlotRecipe({key: "dialogHelper"})
    const styles = recipe()

const handleGitSelected = () => {
  const res_body = GitRequestSchema.parse({
    owner,
    repo,
    commit,
    branch,
    dir_include: [],
    dir_exclude: [],
    file_extension_include: [],
    file_extension_exclude: []
  })

  const new_context_id = uuidv4()

  // Set state if you want to reflect it elsewhere
  useSessionStore.getState().setContextID(new_context_id)
  useSessionStore.getState().setContext("code")

  // ❗️CRUCIAL: pass the new_context_id into upload
  gitFilesUpload(res_body, current_session, new_context_id)
}


    return (
        <Dialog.Root role="alertdialog" open={true}>
            <Portal>
                <Dialog.Backdrop css={styles.backdrop}/>
                <Dialog.Positioner>
                    <Dialog.Content css={styles.content}>
                        <Dialog.Header {...dialogHeader}>
                            <Dialog.Title css={styles.title}>
                                Enter Git Repo Details
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body {...dialogBody}>
                            <VStack color={"transparent"}  pt={"2px"} pb={"2px"}  >
                    <InputGroup startAddon="https://" endAddon=".git" color={"transparent"}>
                        <Input
                            color={"transparent"}
                            placeholder="username/repo-name"

                        />
                    </InputGroup>
                    <HStack gap="4" w="full" pt={"2px"} pb={"2px"} >
                        <Field.Root  color={"white"}>
                            <Field.Label>Owner</Field.Label>
                            <Input
                                    placeholder={"username"}
                                    value={owner}
                                    color={"white"}
                                    onChange={(e)=>setOwner(e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root  color={"white"}>
                            <Field.Label>Repoistory</Field.Label>
                            <Input placeholder={"repo-name"}
                                   value={repo}
                                    color={"white"}
                                   onChange={(e)=>setRepo(e.target.value)}
                            />
                        </Field.Root>
                    </HStack>
                    <HStack gap="4" w="full"  pt={"2px"} pb={"2px"} >
                        <Field.Root   color={"white"}>
                            <Field.Label>Commit</Field.Label>
                            <Input
                                value={commit}
                                placeholder={"commit"}
                                 color={"white"}
                                onChange={(e)=>setCommit(e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label  color={"white"}>Branch</Field.Label>
                            <Input
                                placeholder={"main"}
                                value={branch}
                                 color={"white"}
                                onChange={(e)=>setBranch(e.target.value)}
                            />
                        </Field.Root>
                    </HStack>
                </VStack>
                        </Dialog.Body>
                        <Dialog.Footer {...dialogFooter}>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    css={styles.cancel}
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                css={{
                                    bg: "red.500",
                                   color: "white",
                                    borderRadius:"10px"
                                }}
                                onClick={handleGitSelected}
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

export default GitDialog;