import {
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded, BiEdit, BiShare, BiTrash } from "react-icons/bi";
import useSessions from "../hooks/useSessions.ts";
import { useEffect, useState } from "react";
import { getAllSessions } from "../api/session-api.ts";
import type Session from "../entities/Session.ts";

interface Props {
    title: string;
    sessionId: string;
    onSelect?: () => void;
}

const Chat = ({ title, sessionId, onSelect }: Props) => {
    const { changeTitle, deleteSessionById } = useSessions();
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const allSessions = await getAllSessions();
                setSessions(allSessions);
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            }
        };
        fetchSessions();
    }, []);

    const handleChangeTitle = async () => {
        const newTitle = prompt("Enter new title:", title);
        if (newTitle && newTitle.trim()) {
            try {
                await changeTitle(newTitle.trim());
            } catch (error) {
                console.error("Failed to change title:", error);
            }
        }
    };

    const handleDeleteSession = async () => {
        if (confirm("Are you sure you want to delete this session?")) {
            try {
                await deleteSessionById(sessionId);
            } catch (error) {
                console.error("Failed to delete session:", error);
            }
        }
    };

    return (
        <HStack
            justifyContent="space-between"
            w="100%"
            p={1}
            _hover={{
                bg: "surface.tertiary",
                borderColor: "app.accent",
                transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
            onClick={onSelect}
        >
            <Text
                isTruncated
                color="app.text.primary"
                fontSize="sm"
                fontWeight="medium"
                flex="1"
            >
                {title}
            </Text>

            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<BiDotsVerticalRounded />}
                    variant="ghost"
                    aria-label="More Options"
                    size="sm"
                    color="app.text.secondary"
                    _hover={{
                        bg: "surface.tertiary",
                        color: "app.accent",
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
                <MenuList
                    bg="app.card.bg"
                    borderColor="app.border"
                    shadow="lg"
                >
                    <MenuItem
                        icon={<BiEdit />}
                        _hover={{ bg: "surface.tertiary" }}
                        onClick={handleChangeTitle}
                        color="app.text.primary"
                    >
                        Change Title
                    </MenuItem>
                    <MenuItem
                        icon={<BiTrash />}
                        onClick={handleDeleteSession}
                        _hover={{ bg: "red.600" }}
                        color="app.text.primary"
                    >
                        Delete
                    </MenuItem>
                    <MenuItem
                        icon={<BiShare />}
                        _hover={{ bg: "surface.tertiary" }}
                        color="app.text.primary"
                    >
                        Share
                    </MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    );
};

export default Chat;