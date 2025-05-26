import {
    Editable, EditableInput, EditablePreview,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useToast,
} from "@chakra-ui/react";
import {BiDotsVerticalRounded, BiEdit, BiShare, BiTrash} from "react-icons/bi";
import useSessions from "../hooks/useSessions.ts";
import {useRef, useState} from "react";

interface Props {
    title: string;
    sessionId: string;
    onSelect?: () => void;
}

const SessionComponent = ({title, sessionId, onSelect}: Props) => {
    const {changeTitle, deleteSessionById} = useSessions();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
    const toast = useToast();

    const inputRef = useRef<HTMLInputElement>(null)


    const handleChangeTitleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        inputRef.current?.focus()

    };

    const handleTitleUpdate = async (nextValue: string) => {
        const trimmed = nextValue.trim();
        if (trimmed !== title) {
            setIsUpdatingTitle(true);
            try {
                await changeTitle(trimmed); // call the passed-in prop
                toast({
                    title: "Title updated",
                    description: `Session title changed to "${trimmed}"`,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Failed to change title:", error);
                toast({
                    title: "Error",
                    description: "Failed to update session title",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
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
                toast({
                    title: "Session deleted",
                    description: `"${title}" has been deleted`,
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Failed to delete session:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete session",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsDeleting(false);
            }
        }
    };


    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast({
            title: "Coming Soon",
            description: "Share functionality will be available soon",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <HStack
            justifyContent="space-between"
            w="100%"
            p={2.5}

            _hover={{
                bg: "surface.tertiary",
                transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
            onClick={onSelect}
            border={"0px"}
            borderRadius="lg"
            textUnderlineOffset={"unset"}
            opacity={isDeleting ? 0.5 : 1}
            pointerEvents={isDeleting ? "none" : "auto"}
        >
            <Editable
                defaultValue={title}
                onSubmit={handleTitleUpdate}
                isDisabled={isUpdatingTitle}
            >
                <EditablePreview
                    as={Text}
                    isTruncated
                    border={"0px"}
                    color="app.text.primary"
                    fontSize="sm"
                    fontWeight="medium"
                    flex="1"
                    opacity={isUpdatingTitle ? 0.7 : 1}
                />
                <EditableInput
                    ref={inputRef}
                    fontSize="sm"
                    fontWeight="medium"
                    flex="1"
                    px={1}
                    borderRadius="md"
                />
            </Editable>


            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<BiDotsVerticalRounded/>}
                    variant="ghost"
                    aria-label="More Options"
                    size="sm"
                    color="app.text.secondary"
                    _hover={{
                        bg: "surface.tertiary",
                        color: "app.accent",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    isDisabled={isDeleting || isUpdatingTitle}
                />
                <MenuList
                    bg="app.card.bg"
                    borderColor="app.border"
                    shadow="lg"
                >
                    <MenuItem
                        icon={<BiEdit/>}
                        _hover={{bg: "surface.tertiary"}}
                        onClick={handleChangeTitleClick}
                        color="app.text.primary"
                        isDisabled={isUpdatingTitle}
                    >
                        {isUpdatingTitle ? "Updating..." : "Change Title"}
                    </MenuItem>

                    <MenuItem
                        icon={<BiShare/>}
                        _hover={{bg: "surface.tertiary"}}
                        onClick={handleShare}
                        color="app.text.primary"
                    >
                        Share
                    </MenuItem>
                    <MenuItem
                        icon={<BiTrash/>}
                        onClick={handleDeleteSession}
                        _hover={{bg: "red.600", color: "white"}}
                        color="red.400"
                        isDisabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    );
};

export default SessionComponent;