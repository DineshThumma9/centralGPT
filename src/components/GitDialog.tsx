"use client"


import {


    Button,
    Dialog,
    Field,
    HStack,
    Input,
    InputGroup,
    Portal, Spinner,

    useSlotRecipe,
    VStack
} from "@chakra-ui/react"
import {useEffect, useState} from "react";
import {v4} from "uuid";
import useSessionStore from "../store/sessionStore.ts";
import {z} from "zod";
import {gitFilesUpload} from "../api/rag-api.ts";
import SelectOptions from "./Select.tsx";
import {Toaster,toaster} from "./ui/toaster.tsx"


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
    const [owner, setOwner] = useState("")
    const [repo, setRepo] = useState("")
    const [branch, setBranch] = useState("main")
    const [commit, setCommit] = useState("")

    const [dirInput, setDirInput] = useState("")
    const [fileExtInput, setFileExtInput] = useState("")
    const [dirOption, setDirOption] = useState<string[]>([])
    const [fileExtOption, setFileExtOption] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const {current_session} = useSessionStore()
    const recipe = useSlotRecipe({key: "dialogHelper"})
    const styles = recipe()

    const inputStyles = {
        borderRadius: "xl",
        border: "2px solid",
        borderColor: "rgba(139, 92, 246, 0.3)",
        bg: "rgba(139, 92, 246, 0.05)",
        color: "white",
        _placeholder: {color: "rgba(255, 255, 255, 0.6)"},
        _hover: {
            borderColor: "rgba(139, 92, 246, 0.5)",
            bg: "rgba(139, 92, 246, 0.1)"
        },
        _focus: {
            borderColor: "rgba(139, 92, 246, 0.6)",
            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
            bg: "rgba(139, 92, 246, 0.1)"
        },
        transition: "all 0.2s ease"
    }


    useEffect(() => {
         if (loading) {
    toaster.create({
      title: "Loading...",
      description: "Reading -> splitting -> indexing -> retriever",
      type: "loading"
    });
  }
    },[loading])

    const handleGitSelected = async () => {
        if (!owner.trim() || !repo.trim()) {
            toaster.create({
                title: "Missing fields",
                description: "Please provide both owner and repository name.",
                type: "error",
                duration: 3000,
            });
            return;
        }

        onConfirm();



        setLoading(true);
        try {
            const parsedDirs = dirInput.split(",").map(d => d.trim()).filter(Boolean);
            const parsedExts = fileExtInput.split(",").map(e => e.trim()).filter(Boolean);

            const res_body = GitRequestSchema.parse({
                owner: owner.trim(),
                repo: repo.trim(),
                commit: commit.trim() || undefined,
                branch: branch.trim() || "main",
                dir_include: dirOption[0] === "Include" ? parsedDirs : [],
                dir_exclude: dirOption[0] === "Exclude" ? parsedDirs : [],
                file_extension_include: fileExtOption[0] === "Include" ? parsedExts : undefined,
                file_extension_exclude: fileExtOption[0] === "Exclude" ? parsedExts : undefined
            });

            const new_context_id = v4();
            useSessionStore.getState().setContextID(new_context_id);
            useSessionStore.getState().setContext("code");

            const res = await gitFilesUpload(res_body, current_session, new_context_id);

            toaster.create({
                title: res ? "Upload Complete" : "Upload Failed",
                description: res ? "Git repository connected and data indexed." : "Something went wrong with the upload.",
                type: res ? "success" : "error",
                duration: 3000,
            });



        } catch (error) {


            console.error("Git upload error:", error);
            toaster.create({
                title: "Unexpected Error",
                description: "Something went wrong while connecting.",
                type: "error",
                duration: 3000,
            });


        } finally {
            setLoading(false);
        }
    };

    return (
        <>



            <Dialog.Root role="alertdialog" open={true}>
                <Portal>
                    <Dialog.Backdrop
                        css={{
                            ...styles.backdrop,
                            backdropFilter: "blur(8px)",
                            bg: "rgba(0, 0, 0, 0.6)"
                        }}
                    />
                    <Dialog.Positioner>
                        <Dialog.Content
                            css={{
                                ...styles.content,
                                bg: "rgba(20, 20, 30, 0.95)",
                                backdropFilter: "blur(20px)",
                                border: "2px solid rgba(139, 92, 246, 0.3)",
                                borderRadius: "2xl",
                                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)"
                            }}
                        >
                            <Dialog.Header {...dialogHeader}>
                                <Dialog.Title css={{
                                    ...styles.title,
                                    color: "white",
                                    fontSize: "2xl",
                                    fontWeight: "bold"
                                }}>
                                    Connect Git Repository
                                </Dialog.Title>
                            </Dialog.Header>

                            <Dialog.Body {...dialogBody}>
                                <VStack gap={6} align="stretch">
                                    {/* Repository URL Preview */}
                                    <InputGroup
                                        startAddon="https://github.com/"
                                        endAddon=".git"
                                        css={{
                                            "& > div": {
                                                bg: "rgba(139, 92, 246, 0.1)",
                                                border: "2px solid rgba(139, 92, 246, 0.3)",
                                                borderRadius: "xl",
                                                color: "rgba(255, 255, 255, 0.7)"
                                            }
                                        }}
                                    >
                                        <Input
                                            placeholder="owner/repository"
                                            value={`${owner}/${repo}`}
                                            readOnly
                                            {...inputStyles}
                                        />
                                    </InputGroup>

                                    {/* Owner and Repository */}
                                    <HStack gap={4}>
                                        <Field.Root flex={1}>
                                            <Field.Label color="white" fontSize="sm" fontWeight="medium">
                                                Owner *
                                            </Field.Label>
                                            <Input
                                                placeholder="github-username"
                                                value={owner}
                                                onChange={(e) => setOwner(e.target.value)}
                                                {...inputStyles}
                                            />
                                        </Field.Root>
                                        <Field.Root flex={1}>
                                            <Field.Label color="white" fontSize="sm" fontWeight="medium">
                                                Repository *
                                            </Field.Label>
                                            <Input
                                                placeholder="repo-name"
                                                value={repo}
                                                onChange={(e) => setRepo(e.target.value)}
                                                {...inputStyles}
                                            />
                                        </Field.Root>
                                    </HStack>

                                    {/* Branch and Commit */}
                                    <HStack gap={4}>
                                        <Field.Root flex={1}>
                                            <Field.Label color="white" fontSize="sm" fontWeight="medium">
                                                Branch
                                            </Field.Label>
                                            <Input
                                                placeholder="main"
                                                value={branch}
                                                onChange={(e) => setBranch(e.target.value)}
                                                {...inputStyles}
                                            />
                                        </Field.Root>
                                        <Field.Root flex={1}>
                                            <Field.Label color="white" fontSize="sm" fontWeight="medium">
                                                Commit (optional)
                                            </Field.Label>
                                            <Input
                                                placeholder="commit-hash"
                                                value={commit}
                                                onChange={(e) => setCommit(e.target.value)}
                                                {...inputStyles}
                                            />
                                        </Field.Root>
                                    </HStack>

                                    {/* Directory Filters */}
                                    <VStack gap={4} align="stretch">
                                        <HStack gap={4} align="flex-end">
                                            <Field.Root flex={1}>
                                                <Field.Label color="white" fontSize="sm" fontWeight="medium">
                                                    Directory Filters (comma-separated)
                                                </Field.Label>
                                                <Input
                                                    placeholder="src/, docs/, tests/"
                                                    value={dirInput}
                                                    onChange={(e) => setDirInput(e.target.value)}
                                                    {...inputStyles}
                                                />
                                            </Field.Root>
                                            <SelectOptions value={dirOption} setValue={setDirOption}/>
                                        </HStack>

                                        <HStack gap={4} align="flex-end">
                                            <Field.Root flex={1}>
                                                <Field.Label color="white" fontSize="sm" fontWeight="medium">
                                                    File Extension Filters (comma-separated)
                                                </Field.Label>
                                                <Input
                                                    placeholder=".ts, .tsx, .js, .jsx"
                                                    value={fileExtInput}
                                                    onChange={(e) => setFileExtInput(e.target.value)}
                                                    {...inputStyles}
                                                />
                                            </Field.Root>
                                            <SelectOptions value={fileExtOption} setValue={setFileExtOption}/>
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </Dialog.Body>

                            <Dialog.Footer {...dialogFooter}>
                                <Dialog.ActionTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        color="white"
                                        borderRadius="xl"
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.1)"
                                        }}
                                        onClick={onCancel}

                                    >
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    bg="linear-gradient(135deg, #8B5CF6, #A855F7)"
                                    color="white"
                                    borderRadius="xl"
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)"
                                    }}
                                    _active={{
                                        transform: "translateY(0)"
                                    }}
                                    onClick={handleGitSelected}
                                    disabled={loading || !owner.trim() || !repo.trim()}
                                    loading={loading}
                                    loadingText="Connecting..."
                                    transition="all 0.2s ease"

                                >
                                    Connect Repository
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};

export default GitDialog;