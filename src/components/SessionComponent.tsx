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


const centerProps = {
    justifyContent: "space-between",
    w: "100%",
    px: 4,
    py: 3,
    height: "50px",
    bg: "linear-gradient(135deg, rgba(26, 10, 46, 0.6) 0%, rgba(45, 27, 61, 0.6) 100%)",
    color: "white",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(26, 10, 46, 0.2)",
    cursor: "pointer",
    border: "1px solid rgba(139, 69, 197, 0.15)",
    backdropFilter: "blur(10px)"
}


const menuContent = {
    bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 100%)",
    borderColor: "rgba(139, 69, 197, 0.3)",
    shadow: "0 10px 40px rgba(26, 10, 46, 0.4)",
    borderRadius: "12px",
    border: "1px solid rgba(139, 69, 197, 0.2)",
    backdropFilter: "blur(20px)",
}


const menuItem = {
    color: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    mx: 1,
    my: 1,
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
                await changeTitle(sessionId, trimmed);
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
                {...centerProps}
                _hover={{
                    bg: "linear-gradient(135deg, rgba(139, 69, 197, 0.2) 0%, rgba(107, 70, 193, 0.2) 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 25px rgba(139, 69, 197, 0.15)"
                }}
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
                            color="rgba(255, 255, 255, 0.95)"
                            lineClamp={1}
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            opacity={isUpdatingTitle ? 0.7 : 1}
                            cursor={isUpdatingTitle ? "default" : "text"}
                            _hover={{
                                opacity: isUpdatingTitle ? 0.7 : 0.8,
                                color: "rgba(139, 69, 197, 0.9)"
                            }}
                            transition="all 0.2s"
                        >
                            {title}
                        </Text>
                    </Editable.Preview>
                    <Editable.Input
                        fontSize="sm"
                        fontWeight="medium"
                        px={3}
                        py={2}
                        borderRadius="10px"
                        color="white"
                        bg="rgba(26, 10, 46, 0.8)"
                        border="1px solid rgba(139, 69, 197, 0.4)"
                        _focus={{
                            borderColor: "#8b45c5",
                            boxShadow: "0 0 0 2px rgba(139, 69, 197, 0.2)",
                            outline: "none",
                            bg: "rgba(26, 10, 46, 0.9)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                handleEditCancel();
                            }
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
                            color="rgba(255, 255, 255, 0.6)"
                            _hover={{
                                color: "#8b45c5",
                                bg: "rgba(139, 69, 197, 0.15)",
                                transform: "scale(1.1)"
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={isDeleting || isUpdatingTitle}
                            borderRadius="10px"
                            transition="all 0.2s"
                        >
                            <MoreVertical size={16}/>
                        </IconButton>
                    </MenuTrigger>
                    <Portal>
                        <MenuPositioner>
                            <MenuContent
                                {...menuContent}
                            >
                                <MenuItem
                                    value="title"
                                    onClick={handleChangeTitleClick}
                                    disabled={isUpdatingTitle}
                                    _hover={{
                                        bg: "rgba(139, 69, 197, 0.2)",
                                        color: "white"
                                    }}
                                    {...menuItem}
                                >
                                    <Edit size={16}/>
                                    {isUpdatingTitle ? "Updating..." : "Rename"}
                                </MenuItem>
                                <MenuItem
                                    value="share"
                                    onClick={handleShare}
                                    _hover={{
                                        bg: "rgba(6, 182, 212, 0.2)",
                                        color: "white"
                                    }}
                                    {...menuItem}
                                >
                                    <Share size={16}/>
                                    Share
                                </MenuItem>
                                <MenuItem
                                    value="delete"
                                    onClick={() => setIsDialog(true)}
                                    _hover={{bg: "rgba(239, 68, 68, 0.2)", color: "white"}}
                                    disabled={isDeleting}
                                    {...menuItem}
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