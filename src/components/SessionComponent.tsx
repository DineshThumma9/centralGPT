import {
    Editable,
    HStack,
    IconButton,
    Text,
    createToaster,
    MenuPositioner,
    Portal,
} from "@chakra-ui/react";
import {MoreVertical, Edit, Share, Trash} from "lucide-react";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "./ui/menu.tsx";
import useSessions from "../hooks/useSessions.ts";
import {useState} from "react";

const toaster = createToaster({placement: "top"});

interface Props {
    title: string;
    sessionId: string;
    onSelect?: () => void;
}

const SessionComponent = ({title, sessionId, onSelect}: Props) => {
    const {changeTitle, deleteSessionById} = useSessions();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
                await changeTitle(trimmed);
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

    const handleDeleteSession = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete "${title}"? This can't be undone.`)) {
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
        <HStack
            justifyContent="space-between"
            w="100%"
            px={2}
            py={2}
            bg="gray.900"
            _hover={{bg: "gray.800", transform: "scale(1.01)"}}
            transition="all 0.2s ease-in-out"
            borderRadius="md"
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
                        <MenuContent bg="gray.800" borderColor="gray.700" shadow="md">
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
                                onClick={handleDeleteSession}
                                value="delete"
                                color="red.400"
                                _hover={{bg: "red.600", color: "white"}}
                                disabled={isDeleting}
                            >
                                <Trash size={16} />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </MenuItem>
                        </MenuContent>
                    </MenuPositioner>
                </Portal>
            </MenuRoot>
        </HStack>
    );
};

export default SessionComponent;