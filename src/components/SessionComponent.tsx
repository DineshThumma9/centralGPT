import {Center, createToaster, Editable, IconButton, MenuPositioner, Portal, Text,} from "@chakra-ui/react";
import {Edit, MoreVertical, Share, Trash} from "lucide-react";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger,} from "./ui/menu.tsx";
import useSessions from "../hooks/useSessions.ts";
import {useState} from "react";
import DeleteAlert from "./DeleteAlert.tsx";

const toaster = createToaster({placement: "top"});

interface Props {
    title: string;
    sessionId: string;
    onSelect?: () => void;
    color: string
    bg: string
}

const SessionComponent = ({title, sessionId, onSelect, color, bg}: Props) => {
    const {changeTitle, deleteSessionById} = useSessions();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dialog, setIsDialog] = useState(false)




    const handleChangeTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleTitleUpdate = async (newTitle: string) => {
        const trimmed = newTitle.trim();
        setIsEditing(false);

        if (trimmed && trimmed !== title) {
            setIsUpdatingTitle(true);
            try {
                // Fix: Pass sessionId to changeTitle function
                await changeTitle(sessionId, trimmed);
                toaster.create({
                    title: "Title updated",
                    description: `Session title changed to "${trimmed}"`,
                    type: "success",
                    duration: 2000,
                });
            } catch (error) {
                console.error("Failed to update title:", error);
                toaster.create({
                    title: "Error",
                    description: "Failed to update session title",
                    type: "error",
                    duration: 3000,
                });
            } finally {
                setIsUpdatingTitle(false);
            }
        }
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

 const handleDeleteSession = async () => {
    setIsDialog(false);
    setIsDeleting(true);
    try {
        await deleteSessionById(sessionId);
        toaster.create({
            title: "Session deleted",
            description: `"${title}" has been deleted`,
            type: "success",
            duration: 2000,
        });
    } catch {
        toaster.create({
            title: "Error",
            description: "Failed to delete session",
            type: "error",
            duration: 3000,
        });
    } finally {
        setIsDeleting(false);
    }
};


    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        toaster.create({
            title: "Coming Soon",
            description: "Share functionality is not implemented yet",
            type: "info",
            duration: 2000,
        });
    };

    return (
        <>
        <Center
            justifyContent="space-between"
            w="100%"
            px={2}
            py={2}
            text-overflow={"clip"}
            height={"40px"}
            width={"1fr"}
            bg={bg}
            color={color}
            overflow="hidden"
            _hover={{bg: "gray.800", transform: "scale(1.01)"}}
            transition="all 0.2s ease-in-out"
            borderRadius="lg"
            boxShadow="lg"
            cursor="pointer"
            onClick={onSelect}
            opacity={isDeleting ? 0.5 : 1}

        >
            <Editable.Root
                value={title}

                edit={isEditing}
                onEditChange={({edit}) => setIsEditing(edit)}
                onValueCommit={({value}) => handleTitleUpdate(value)}
                onValueRevert={handleEditCancel}
                disabled={isUpdatingTitle}
                selectOnFocus={true}
            >
                <Editable.Preview
                    asChild
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isUpdatingTitle) {
                            setIsEditing(true);
                        }
                    }}
                >
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="white"
                        lineClamp={1}
                        overflow={"hidden"}
                        // This ensures text truncation
                        whiteSpace="nowrap" // Prevents text from wrapping

                        textOverflow="ellipsis" // Adds ellipsis for overflow text
                        opacity={isUpdatingTitle ? 0.7 : 1}
                        cursor={isUpdatingTitle ? "default" : "text"}
                        _hover={{
                            opacity: isUpdatingTitle ? 0.7 : 0.8
                        }}
                    >
                        {title}
                    </Text>
                </Editable.Preview>
                <Editable.Input
                    fontSize="sm"
                    fontWeight="medium"
                    px={2}
                    py={1}
                    borderRadius="md"
                    color="white"
                    bg="gray.700"
                    border="1px solid"
                         _hover={{bg: "gray.800", transform: "scale(1.01)"}}
                    borderColor="blue.400"
                    _focus={{
                        borderColor: "blue.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                        outline: "none"
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            handleEditCancel();
                        }
                        // Fix: Handle Enter key to save changes
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const target = e.target as HTMLInputElement;
                            handleTitleUpdate(target.value);
                        }
                    }}
                />
            </Editable.Root>

            <MenuRoot>
                <MenuTrigger asChild>
                    <IconButton
                        variant="ghost"
                        aria-label="More Options"
                        size="sm"
                        color="gray.400"
                        _hover={{color: "blue.400", bg: "gray.800"}}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isDeleting || isUpdatingTitle}
                    >
                        <MoreVertical size={16}/>
                    </IconButton>
                </MenuTrigger>
                <Portal>
                    <MenuPositioner>
                        <MenuContent bg="white" borderColor="gray.700" shadow="md">
                            <MenuItem
                                value="title"
                                onClick={handleChangeTitleClick}
                                disabled={isUpdatingTitle}
                            >
                                <Edit size={16}/>
                                {isUpdatingTitle ? "Updating..." : "Rename"}
                            </MenuItem>
                            <MenuItem value="share" onClick={handleShare}>
                                <Share size={16}/>
                                Share
                            </MenuItem>

                            <MenuItem
                            value="delete"
                            onClick={() => setIsDialog(true)}
                            color="black"
                            _hover={{bg: "red.600", color: "white"}}
                            disabled={isDeleting}
                        >
                            <Trash size={16}/>
                            Delete
                        </MenuItem>

                        </MenuContent>
                    </MenuPositioner>
                </Portal>


            </MenuRoot>
        </Center>

           {dialog && (
                <DeleteAlert
                    onCancel={() => setIsDialog(false)}
                    onConfirm={handleDeleteSession}
                />
            )}

    </>
    );
};

export default SessionComponent;