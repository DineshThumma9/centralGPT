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
import {useColorMode} from "../contexts/ColorModeContext.tsx";

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
    const { colors } = useColorMode();

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
        } catch (err) {
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
                color={colors.text.primary}
                overflow="hidden"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                borderRadius="16px"
                boxShadow={`0 4px 15px ${colors.shadow.md}`}
                cursor="pointer"
                border={`1px solid ${colors.border.secondary}`}
                backdropFilter="blur(10px)"
                onClick={onSelect}
                opacity={isDeleting ? 0.5 : 1}
                _hover={{
                    bg: colors.background.hover,
                    transform: "translateY(-1px)",
                    boxShadow: `0 8px 25px ${colors.shadow.lg}`
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
                                    color={colors.text.primary}
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                    opacity={isUpdatingTitle ? 0.7 : 1}
                                    cursor={isUpdatingTitle ? "default" : "text"}
                                    _hover={{
                                        opacity: isUpdatingTitle ? 0.7 : 0.8,
                                        color: colors.text.accent
                                    }}
                                    transition="all 0.2s"
                                >
                                    {title.slice(0, 30) + "..."}
                                </Text>
                            </Editable.Preview>
                            <Editable.Input
                                fontSize="sm"
                                fontWeight="medium"
                                px={3}
                                py={2}
                                borderRadius="10px"
                                color={colors.text.primary}
                                bg={colors.background.card}
                                border="1px solid"
                                borderColor={colors.border.default}
                                _focus={{
                                    borderColor: colors.border.focus,
                                    boxShadow: `0 0 0 2px ${colors.border.focus}`,
                                    outline: "none",
                                    bg: colors.background.hover
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
                                    color={colors.text.secondary}
                                    _hover={{
                                        bg: colors.background.hover,
                                        color: colors.text.primary
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
                                            _hover={{bg: colors.background.hover, color: colors.text.danger}}
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
