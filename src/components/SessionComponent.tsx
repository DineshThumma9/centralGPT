import {
    Box,
    createToaster,
    Editable,
    Flex,
    IconButton,
    MenuPositioner,
    Portal,
    Text,
    useSlotRecipe,
} from "@chakra-ui/react";
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

const SessionComponent = ({title, sessionId, onSelect}: Props) => {
    const {changeTitle, deleteSessionById} = useSessions();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dialog, setIsDialog] = useState(false);
    const recipe = useSlotRecipe({key: "menuHelper"})
    const styles = recipe({visual: "session"})

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
        } catch(err) {
            console.log("Error has occurred", err)
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
            <Box
                w="100%"
                px={4}
                py={3}
                height="50px"
                color="white"
                overflow="hidden"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                borderRadius="16px"
                boxShadow="0 4px 15px rgba(26, 10, 46, 0.2)"
                cursor="pointer"
                border="1px solid rgba(139, 69, 197, 0.15)"
                backdropFilter="blur(10px)"
                onClick={onSelect}
                opacity={isDeleting ? 0.5 : 1}
                _hover={{
                    bg: "linear-gradient(135deg, rgba(139, 69, 197, 0.2) 0%, rgba(107, 70, 193, 0.2) 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 25px rgba(139, 69, 197, 0.15)"
                }}
            >
                <Flex justify="space-between" align="center" w="100%" h="100%" borderRadius={"inherit"}>
                    {/* Title section - takes available space */}
                    <Box flex="1" minW={0} mr={2}>
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
                                    {title.slice(0,30) + "..."}
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
                    </Box>

                    {/* Menu button - fixed width, always visible */}
                    <Box flexShrink={0}>
                        <MenuRoot>
                            <MenuTrigger asChild>
                                <IconButton
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isDeleting || isUpdatingTitle}
                                    size="sm"
                                    variant="ghost"
                                    color="rgba(255, 255, 255, 0.7)"
                                    _hover={{
                                        bg: "rgba(139, 69, 197, 0.2)",
                                        color: "white"
                                    }}
                                >
                                    <MoreVertical size={16}/>
                                </IconButton>
                            </MenuTrigger>
                            <Portal>
                                <MenuPositioner>
                                    <MenuContent
                                        css={styles.content}
                                    >
                                        <MenuItem
                                            value="title"
                                            onClick={handleChangeTitleClick}
                                            disabled={isUpdatingTitle}
                                            css={styles.item}
                                        >
                                            <Edit size={16}/>
                                            {isUpdatingTitle ? "Updating..." : "Rename"}
                                        </MenuItem>
                                        <MenuItem
                                            value="share"
                                            onClick={handleShare}
                                            css={styles.item}
                                        >
                                            <Share size={16}/>
                                            Share
                                        </MenuItem>
                                        <MenuItem
                                            value="delete"
                                            onClick={() => setIsDialog(true)}
                                            _hover={{bg: "rgba(239, 68, 68, 0.2)", color: "white"}}
                                            disabled={isDeleting}
                                            css={styles.item}
                                        >
                                            <Trash size={16}/>
                                            Delete
                                        </MenuItem>
                                    </MenuContent>
                                </MenuPositioner>
                            </Portal>
                        </MenuRoot>
                    </Box>
                </Flex>
            </Box>

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