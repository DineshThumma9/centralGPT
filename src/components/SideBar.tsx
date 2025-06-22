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

        getSessions();

        return unsubscribe;
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
            w={collapsed ? "60px" : "280px"}
            transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            bg="#0f0f0f"
            color="white"
            h="100vh"
            position="relative"
            borderRight="1px solid #2a2a2a"
            display="flex"
            flexDirection="column"
        >
            {/* Header with toggle button */}
            <Box p={3} borderBottom="1px solid #2a2a2a">
                <Button
                    aria-label="Toggle sidebar"
                    size="sm"
                    variant="ghost"
                    onClick={handleToggle}
                    color="gray.400"
                    _hover={{
                        bg: "#2a2a2a",
                        color: "white",
                        transform: "scale(1.05)",
                    }}
                    _active={{
                        transform: "scale(0.95)",
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    borderRadius="md"
                    p={2}
                >
                    {collapsed ? <FiChevronRight size={18}/> : <FiChevronLeft size={18}/>}
                </Button>
            </Box>

            {/* Main content area */}
            <VStack
                align="stretch"
                gap={0}
                flex="1"
                overflow="hidden"
            >
                {!collapsed && (
                    <>
                        {/* Navigation */}
                        <Box p={3} borderBottom="1px solid #2a2a2a">
                            <SideBarNav/>
                        </Box>

                        {/* Sessions list */}
                        <Box
                            flex="1"
                            overflowY="auto"
                            p={2}
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
                            {isLoading && sessions.length === 0 && (
                                <Box p={6} textAlign="center">
                                    <Text fontSize="sm" color="gray.500">
                                        Loading sessions...
                                    </Text>
                                </Box>
                            )}

                            {!isLoading && sessions.length === 0 && (
                                <Box p={6} textAlign="center">
                                    <Text fontSize="sm" color="gray.500" lineHeight="1.6">
                                        No chat sessions yet.
                                        <br/>
                                        Create your first chat!
                                    </Text>
                                </Box>
                            )}

                            <VStack gap={1} align="stretch">
                                {(() => {
                                    const sortedSessions = sessions
                                        .filter((s) => s.session_id !== currentSession)
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                                    const current = sessions.find((s) => s.session_id === currentSession);
                                    const allSessions = current ? [current, ...sortedSessions] : sortedSessions;

                                    return allSessions.map((session) => {
                                        const sessionId = session.session_id!;
                                        const isActive = currentSession === sessionId;

                                        return (
                                            <Box
                                                key={sessionId}
                                                bg={isActive ? "#1a1a1a" : "transparent"}
                                                borderRadius="lg"
                                                border={isActive ? "1px solid #333" : "1px solid transparent"}
                                                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                                _hover={{
                                                    bg: isActive ? "#1a1a1a" : "#161616",
                                                    border: "1px solid #404040",
                                                }}
                                                overflow="hidden"
                                            >
                                                <SessionComponent
                                                    bg="transparent"
                                                    color={isActive ? "white" : "gray.300"}
                                                    title={session.title || "New Chat"}
                                                    sessionId={sessionId}
                                                    onSelect={() => handleSessionSelect(sessionId)}
                                                />
                                            </Box>
                                        );
                                    });
                                })()}
                            </VStack>
                        </Box>

                        {/* Settings footer */}
                        <Box p={3} borderTop="1px solid #2a2a2a">
                            <HStack
                                gap={3}
                                p={3}
                                bg="transparent"
                                borderRadius="lg"
                                cursor="pointer"
                                _hover={{
                                    bg: "#1a1a1a",
                                }}
                                transition="background 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <SettingsIcon size={20} color="#9ca3af"/>
                                <Text fontSize="sm" color="gray.400" fontWeight="medium">
                                    Settings
                                </Text>
                            </HStack>
                        </Box>
                    </>
                )}

                {/* Collapsed state */}
                {collapsed && (
                    <Box
                        p={3}
                        display="flex"
                        justifyContent="center"
                        mt="auto"
                        mb={3}
                    >
                        <Box
                            p={2}
                            borderRadius="lg"
                            cursor="pointer"
                            _hover={{
                                bg: "#1a1a1a",
                                transform: "scale(1.1)"
                            }}
                            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            <SettingsIcon size={20} color="#9ca3af"/>
                        </Box>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}