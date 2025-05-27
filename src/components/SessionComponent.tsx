import {
    Editable,
    HStack,
    IconButton,
    Text,
    createToaster,
} from "@chakra-ui/react";
import {MoreVertical, Edit, Share, Trash} from "lucide-react";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "./ui/menu.tsx";
import useSessions from "../hooks/useSessions.ts";
import {useRef, useState} from "react";

// Create toaster instance
const toaster = createToaster({
    placement: "top",
});

interface Props {
    title: string;
    sessionId: string;
    onSelect?: () => void;
}

const SessionComponent = ({title, sessionId, onSelect}: Props) => {
    const {changeTitle, deleteSessionById} = useSessions();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null)

    const handleChangeTitleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        inputRef.current?.focus()
    };

    const handleTitleUpdate = async (value: string) => {
        const trimmed = value.trim();
        if (trimmed !== title) {
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
                console.error("Failed to change title:", error);
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

    const handleDeleteSession = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            setIsDeleting(true);
            try {
                await deleteSessionById(sessionId);
                toaster.create({
                    title: "Session deleted",
                    description: `"${title}" has been deleted`,
                    type: "success",
                    duration: 2000,
                });
            } catch (error) {
                console.error("Failed to delete session:", error);
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
            description: "Share functionality will be available soon",
            type: "info",
            duration: 2000,
        });
    };

    return (
        <HStack
            justifyContent="space-between"
            w="100%"
            p={2.5}
            css={{
                "&:hover": {
                    bg: "var(--chakra-colors-surface-tertiary)",
                    transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out"
            }}
            cursor="pointer"
            onClick={onSelect}
            border={"0px"}
            borderRadius="lg"
            textUnderlineOffset={"unset"}
            opacity={isDeleting ? 0.5 : 1}
            pointerEvents={isDeleting ? "none" : "auto"}
        >
            <Editable.Root
                defaultValue={title}
                onValueChange={({ value }) => handleTitleUpdate(value)}
                disabled={isUpdatingTitle}
            >
                <Editable.Preview
                    asChild
                >
                    <Text
                        truncate
                        border={"0px"}
                        color="app.text.primary"
                        fontSize="sm"
                        fontWeight="medium"
                        flex="1"
                        opacity={isUpdatingTitle ? 0.7 : 1}
                    />
                </Editable.Preview>
                <Editable.Input
                    ref={inputRef}
                    fontSize="sm"
                    fontWeight="medium"
                    flex="1"
                    px={1}
                    borderRadius="md"
                />
            </Editable.Root>

            <MenuRoot>
                <MenuTrigger asChild>
                    <IconButton
                        variant="ghost"
                        aria-label="More Options"
                        size="sm"
                        color="app.text.secondary"
                        css={{
                            "&:hover": {
                                bg: "var(--chakra-colors-surface-tertiary)",
                                color: "var(--chakra-colors-app-accent)",
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isDeleting || isUpdatingTitle}
                    >
                        <MoreVertical />
                    </IconButton>
                </MenuTrigger>
                <MenuContent
                    bg="app.card.bg"
                    borderColor="app.border"
                    shadow="lg"
                >
                    <MenuItem
                        value="edit"
                        css={{
                            "&:hover": { bg: "var(--chakra-colors-surface-tertiary)" }
                        }}
                        onClick={handleChangeTitleClick}
                        color="app.text.primary"
                        disabled={isUpdatingTitle}
                    >
                        <Edit />
                        {isUpdatingTitle ? "Updating..." : "Change Title"}
                    </MenuItem>

                    <MenuItem
                        value="share"
                        css={{
                            "&:hover": { bg: "var(--chakra-colors-surface-tertiary)" }
                        }}
                        onClick={handleShare}
                        color="app.text.primary"
                    >
                        <Share />
                        Share
                    </MenuItem>

                    <MenuItem
                        value="delete"
                        onClick={handleDeleteSession}
                        css={{
                            "&:hover": {
                                bg: "var(--chakra-colors-red-600)",
                                color: "white"
                            }
                        }}
                        color="red.400"
                        disabled={isDeleting}
                    >
                        <Trash />
                        {isDeleting ? "Deleting..." : "Delete"}
                    </MenuItem>
                </MenuContent>
            </MenuRoot>
        </HStack>
    );
};

export default SessionComponent;