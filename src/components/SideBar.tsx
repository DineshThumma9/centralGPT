import {Box, HStack, IconButton, Text, VStack} from "@chakra-ui/react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {useEffect, useState} from "react";
import SideBarNav from "./SideBarNav.tsx";
import {SettingsIcon} from "@chakra-ui/icons";
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

        // Get initial state
        const initialState = sessionStore.getState();
        setSessions(initialState.sessions);
        setCurrentSession(initialState.current_session);
        setIsLoading(initialState.isLoading);

        return unsubscribe;
    }, []);

    // Load sessions on mount
    useEffect(() => {
        getSessions();
    }, []);

    // Initial collapse state
    useEffect(() => {
        onCollapse?.(collapsed);
    }, []);

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
            bg="app.sidebar.bg"
            color="app.text.primary"
            h="100vh"
            p={4}
            overflow="hidden"
            border={"0px"}
            position="relative"
        >
            <IconButton
                icon={collapsed ? <FiChevronRight/> : <FiChevronLeft/>}
                aria-label="Toggle sidebar"
                size="sm"
                mb={4}
                onClick={handleToggle}
                bg="app.card.bg"
                color="app.text.primary"
                _hover={{
                    bg: "surface.tertiary",
                    transform: "scale(1.05)"
                }}
                _active={{
                    transform: "scale(0.95)"
                }}
                transition="all 0.2s"
            />

            <VStack align="stretch" spacing={4} height="calc(100% - 60px)">
                {!collapsed && (
                    <>
                        <SideBarNav/>

                        {/* Sessions List */}
                        <VStack
                            spacing={2}
                            align="stretch"
                            overflowY="auto"
                            flex="1"
                            css={{
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'transparent',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#404040',
                                    borderRadius: '3px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#505050',
                                },
                            }}
                        >
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

                            {sessions.map((session) => {
                                const sessionId = session.session_id || session.session_id!;
                                const isActive = currentSession === sessionId;

                                return (
                                    <Box
                                        key={sessionId}
                                        bg={isActive ? "app.accent" : "transparent"}
                                        borderRadius="md"
                                        transition="all 0.2s ease-in-out"
                                    >
                                        <SessionComponent
                                            title={session.title}
                                            sessionId={sessionId}
                                            onSelect={() => handleSessionSelect(sessionId)}
                                        />
                                    </Box>
                                );
                            })}
                        </VStack>

                        {/* Settings */}
                        <HStack
                            justify="flex-start"
                            mt="auto"
                            p={2}
                            bg="app.card.bg"
                            borderRadius="md"
                            cursor="pointer"
                            _hover={{
                                bg: "surface.tertiary",
                            }}
                            transition="background 0.2s"
                        >
                            <SettingsIcon color="app.accent"/>
                            <Text fontSize="sm" color="app.text.secondary">Settings</Text>
                        </HStack>
                    </>
                )}

                {collapsed && (
                    <VStack spacing={4} align="center">
                        <SettingsIcon
                            color="app.accent"
                            cursor="pointer"
                            _hover={{transform: "scale(1.1)"}}
                            transition="transform 0.2s"
                        />
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}