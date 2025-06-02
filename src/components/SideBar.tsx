import {Box, Button, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {useEffect, useState} from "react";
import SideBarNav from "./SideBarNav.tsx";
import {SettingsIcon} from "lucide-react";
import SessionComponent from "./SessionComponent.tsx";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import type Session from "../entities/Session.ts";

interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({onCollapse}: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSession, setCurrentSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {getSessions, selectSession} = useSessions();

    const handleToggle = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        onCollapse?.(newCollapsed);
    };

    useEffect(() => {
        const unsubscribe = sessionStore.subscribe((state) => {
            setSessions(state.sessions);
            setCurrentSession(state.current_session);
            setIsLoading(state.isLoading);
        });

        const initialState = sessionStore.getState();
        setSessions(initialState.sessions);
        setCurrentSession(initialState.current_session);
        setIsLoading(initialState.isLoading);

        return unsubscribe;
    }, []);

    useEffect(() => {
        getSessions();
    }, []);

    useEffect(() => {
        onCollapse?.(collapsed);
    }, [collapsed, onCollapse]);

    const handleSessionSelect = async (sessionId: string) => {
        try {
            await selectSession(sessionId);
        } catch (error) {
            console.error("Failed to select session:", error);
        }
    };

    return (
        <Box
            w={collapsed ? "60px" : "350px"}
            transition="all 0.3s ease-in-out"
            bg="black"
            color="app.text.primary"
            h="100vh"
            p={4}
            overflow="hidden"
            border="0px"
            position="relative"
        >
            <Button
                aria-label="Toggle sidebar"
                w={collapsed ? "30px" : null}
                size="sm"
                mb={4}
                borderRadius={"full"}
                onClick={handleToggle}
                bg="lightgrey"
                color="black"
                _hover={{
                    bg: "surface.tertiary",
                    transform: "scale(1.05)",
                }}
                _active={{
                    transform: "scale(0.95)",
                }}
                transition="all 0.2s"
            >
                {collapsed ? <FiChevronRight/> : <FiChevronLeft/>}
            </Button>

            <VStack align="stretch" gap={4} height="calc(100% - 60px)">
                {!collapsed && (
                    <>
                        <SideBarNav/>


                        <VStack
                            gap={2}
                            align="stretch"
                            overflowY="auto"
                            flex="1"
                            css={{
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "transparent",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#404040",
                                    borderRadius: "3px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background: "#505050",
                                },
                            }}
                        >
                            <HStack bg={"white"} color="black"/>

                            {isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color="app.text.muted" textAlign="center">
                                        Loading sessions...
                                    </Text>
                                </Box>
                            )}

                            {!isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color="app.text.muted" textAlign="center">
                                        No chat sessions yet.
                                        <br/>
                                        Create your first chat!
                                    </Text>
                                </Box>
                            )}

                            {sessions
                                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                .map((session) => {
                                    const sessionId = session.session_id!;
                                    const isActive = currentSession === sessionId;

                                    return (
                                        <Stack
                                            key={sessionId}
                                            bg={isActive ? "transparent" : "transparent"} // typo fix below
                                            borderRadius="md"
                                            padding="0px"
                                            margin="0"
                                            transition="all 0.2s ease-in-out"
                                        >
                                            <SessionComponent
                                                title={"dgisgsosbso"}
                                                sessionId={sessionId}
                                                onSelect={() => handleSessionSelect(sessionId)}
                                            />
                                        </Stack>
                                    );
                                })}

                        </VStack>

                        <HStack
                            justifyContent="flex-start"
                            mt="auto"
                            p={2}
                            width={"100vw"}
                            bg="app.card.bg"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{
                                bg: "surface.tertiary",
                            }}
                            transition="background 0.2s"
                            zIndex={2}
                        >

                            <SettingsIcon color="white"/>
                            <Text fontSize="xl" color="app.text.secondary">
                                Settings
                            </Text>
                        </HStack>
                    </>
                )}

                {collapsed && (
                    <Box
                        color="app.accent"
                        cursor="pointer"
                        maxW = "30px"
                        transition="transform 0.2s"
                        _hover={{transform: "scale(1.1)"}}
                        width="100%"
                        alignContent = "center"
                        justifyContent={"center"}
                    >
                        <SettingsIcon color={"white"} w = {"30px"} />
                    </Box>

                )}
            </VStack>
        </Box>
    );
}