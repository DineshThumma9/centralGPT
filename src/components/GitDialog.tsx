"use client"

import {Button, Dialog, Field, HStack, Input, InputGroup, Portal, useSlotRecipe, VStack} from "@chakra-ui/react"
import {useState} from "react";
import {v4} from "uuid";
import useSessionStore from "../store/sessionStore.ts";
import {z} from "zod";
import {gitFilesUpload} from "../api/rag-api.ts";
import SelectOptions from "./Select.tsx";
import {toaster} from "./ui/toaster.tsx"
import {RiArrowRightLine} from "react-icons/ri";
import GitExplorer from "./GitExplorer.tsx";
import {ragAPI} from "../api/apiInstance.ts";
import { useColorMode } from "../contexts/ColorModeContext";

interface Props {
    onCancel: () => void;
    onConfirm: () => void;
}

const dialogHeader = {
    p: 6,
    pb: 4
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
    files: z.array(z.string()).optional()
});

export type GitRequestSchema = z.infer<typeof GitRequestSchema>



export type GitTreeNodeType = {
  name: string;
  path: string;
  type: "tree" | "blob";
  sha?: string;
  size?: number;
  children?: GitTreeNodeType[] | null;
};



export const GitTreeNodeSchema: z.ZodType<GitTreeNodeType> = z.lazy(() =>
  z.object({
    name: z.string(),
    path: z.string(),
    type: z.enum(["tree", "blob"]),
    sha: z.string().optional(),
    size: z.number().optional(),
    children: z.array(GitTreeNodeSchema).nullable().optional(),
  })
);


const GitDialog = ({onConfirm, onCancel}: Props) => {
    const { colors } = useColorMode();
    
    const dialogBody = {
        p: 6,
        pt: 2,
        color: colors.text.primary
    };

    const dialogFooter = {
        p: 6,
        pt: 4,
        gap: 3
    };

    const [owner, setOwner] = useState("")
    const [repo, setRepo] = useState("")
    const [branch, setBranch] = useState("main")
    const [commit, setCommit] = useState("")

    const [dirInput, setDirInput] = useState("")
    const [fileExtInput, setFileExtInput] = useState("")
    const [dirOption, setDirOption] = useState<string[]>([])
    const [fileExtOption, setFileExtOption] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [explorer, setExplorer] = useState(false)
    const [files, setFiles] = useState<GitTreeNodeType[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const {current_session} = useSessionStore()
    const recipe = useSlotRecipe({key: "dialogHelper"})
    const styles = recipe()

    const inputStyles = {
        borderRadius: "xl",
        border: "2px solid",
        borderColor: colors.border.default,
        bg: colors.background.subtle,
        color: colors.text.primary,
        _placeholder: {color: colors.text.secondary},
        _hover: {
            borderColor: colors.border.hover,
            bg: colors.background.hover
        },
        _focus: {
            borderColor: colors.border.focus,
            boxShadow: `0 0 0 3px ${colors.shadow.sm}`,
            bg: colors.background.hover
        },
        transition: "all 0.2s ease"
    }


    const handleContinue = async () => {
        if (!owner.trim() || !repo.trim()) {
            toaster.create({
                title: "Missing fields",
                description: "Please provide both owner and repository name.",
                type: "error",
                duration: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            const body = {
                "repo": repo.trim(),
                "owner": owner.trim(),
                "branch": branch.trim() || "main",
                "commit": commit.trim() || undefined,
            }

            const res = await ragAPI.post("/tree", body, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!res.data) {
                toaster.create({
                    type: "error",
                    closable: true,
                    description: "Some Error has occurred while continuing"
                })
                throw Error("Some error has occurred")
            }

            const files = res.data



            const parsedFiles: GitTreeNodeType[] = []
            for (const file of files) {
                const parseResult = GitTreeNodeSchema.safeParse(file)
                if (parseResult.success) {
                    parsedFiles.push(parseResult.data)
                } else {
                    console.error("Failed to parse file:", file, parseResult.error)
                    toaster.create({
                        type: "error",
                        description: `Some error has occurred parsing file: ${parseResult.error.message}`
                    })
                }
            }

            setFiles(parsedFiles)
            setExplorer(true);

        } catch (error) {
            console.error("Error fetching tree:", error)
            toaster.create({
                type: "error",
                closable: true,
                description: "Failed to fetch repository tree"
            })
        } finally {
            setLoading(false);
        }
    }

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



        if (explorer && selectedFiles.length === 0) {
            toaster.create({
                title: "No files selected",
                description: "Please select at least one file to continue.",
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
                file_extension_exclude: fileExtOption[0] === "Exclude" ? parsedExts : undefined,
                files: explorer ? selectedFiles : undefined
            });

            const new_context_id = v4();
            useSessionStore.getState().setContextID(new_context_id);
            useSessionStore.getState().setContext("code");

            const res =  gitFilesUpload(res_body, current_session, new_context_id);


            toaster.promise(res ,{
                success:{
                    title:"Upload Complete",
                    description:"Git repository connected and data indexed."
                },
                error:{
                    title:"Error Has occured",
                    description:"Git repository isn't connected and data indexed."
                },
                loading:{
                    title:"Loading data ",
                    description:"Git repository is being connected and data indexed."
                }



            })




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
                            bg: colors.shadow.md
                        }}
                    />
                    <Dialog.Positioner>
                        <Dialog.Content
                            css={{
                                ...styles.content,
                                bg: colors.background.card,
                                backdropFilter: "blur(20px)",
                                border: `2px solid ${colors.border.default}`,
                                borderRadius: "2xl",
                                boxShadow: `0 25px 50px ${colors.shadow.lg}`
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
                                {!explorer ? (
                                    <VStack gap={6} align="stretch">
                                        {/* Repository URL Preview */}
                                        <InputGroup
                                            startAddon="https://github.com/"
                                            endAddon=".git"
                                            css={{
                                                "& > div": {
                                                    bg: colors.background.subtle,
                                                    border: `2px solid ${colors.border.default}`,
                                                    borderRadius: "xl",
                                                    color: colors.text.secondary
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
                                ) : (
                                    <GitExplorer
                                        files={files}
                                        selectedFiles={selectedFiles}
                                        setSelectedFiles={setSelectedFiles}
                                    />
                                )}
                            </Dialog.Body>

                            <Dialog.Footer {...dialogFooter}>
                                <Dialog.ActionTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        color={colors.text.primary}
                                        borderRadius="xl"
                                        _hover={{
                                            bg: colors.background.hover
                                        }}
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>

                                <Button
                                    bg={colors.primary.default}
                                    color={colors.text.inverse}
                                    borderRadius="xl"
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 10px 30px ${colors.shadow.md}`
                                    }}
                                    _active={{
                                        transform: "translateY(0)"
                                    }}
                                    onClick={handleGitSelected}
                                    disabled={loading || !owner.trim() || !repo.trim() || (explorer && selectedFiles.length === 0)}
                                    loading={loading}
                                    loadingText="Connecting..."
                                    transition="all 0.2s ease"
                                >
                                    {explorer ? "Connect Repository" : "Add Files"}
                                </Button>

                                {!explorer && (
                                    <Button
                                        bg={colors.primary.default}
                                        color={colors.text.inverse}
                                        borderRadius="xl"
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: `0 10px 30px ${colors.shadow.md}`
                                        }}
                                        _active={{
                                            transform: "translateY(0)"
                                        }}
                                        onClick={handleContinue}
                                        disabled={loading || !owner.trim() || !repo.trim()}
                                        loading={loading}
                                        loadingText="Loading..."
                                        transition="all 0.2s ease"
                                    >
                                        Continue <RiArrowRightLine/>
                                    </Button>
                                )}
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};

export default GitDialog;