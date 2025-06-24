
// src/components/SideBar.tsx
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
            transition="all 0.3s ease-in-out"
            bg="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"
            color="white"
            h="100vh"
            p={4}
            overflow="hidden"
            borderRight="1px solid"
            borderColor="purple.600"
            position="relative"
            boxShadow="4px 0 20px rgba(147, 51, 234, 0.1)"
            css={{
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(147, 51, 234, 0.5)",
                    borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                },
            }}
        >
            <Button
                aria-label="Toggle sidebar"
                width={collapsed ? "32px" : "52px"}
                height={collapsed ? "32px" : "52px"}
                size="sm"
                mb={4}
                borderRadius="full"
                onClick={handleToggle}
                bg="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                color="white"
                border="1px solid"
                borderColor="purple.400"
                _hover={{
                    bg: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 16px rgba(147, 51, 234, 0.4)"
                }}
                _active={{
                    transform: "scale(0.95)",
                }}
                transition="all 0.2s"
                boxShadow="0 2px 12px rgba(147, 51, 234, 0.3)"
            >
                {collapsed ? <FiChevronRight/> : <FiChevronLeft/>}
            </Button>

            <VStack align="stretch" gap={4} height="calc(100% - 80px)">
                {!collapsed && (
                    <>
                        <SideBarNav/>

                        <VStack
                            gap={3}
                            align="stretch"
                            overflowY="auto"
                            flex="1"
                            pr={2}
                            css={{
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "transparent",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "rgba(147, 51, 234, 0.5)",
                                    borderRadius: "3px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background: "rgba(147, 51, 234, 0.7)",
                                },
                            }}
                        >
                            {isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color="purple.200" textAlign="center">
                                        Loading sessions...
                                    </Text>
                                </Box>
                            )}

                            {!isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color="purple.300" textAlign="center" lineHeight="1.6">
                                        No chat sessions yet.
                                        <br/>
                                        Create your first chat!
                                    </Text>
                                </Box>
                            )}

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
                                        <Stack
                                            key={sessionId}
                                            bg={isActive ? "rgba(147, 51, 234, 0.2)" : "transparent"}
                                            borderRadius="lg"
                                            padding="2px"
                                            margin="0"
                                            transition="all 0.2s ease-in-out"
                                            border={isActive ? "1px solid" : "1px solid transparent"}
                                            borderColor={isActive ? "purple.400" : "transparent"}
                                        >
                                            <SessionComponent
                                                bg={isActive ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" : "rgba(45, 27, 105, 0.3)"}
                                                color="white"
                                                title={session.title || "New Chat"}
                                                sessionId={sessionId}
                                                onSelect={() => handleSessionSelect(sessionId)}
                                            />
                                        </Stack>
                                    );
                                });
                            })()}
                        </VStack>

                        <HStack
                            justifyContent="flex-start"
                            mt="auto"
                            p={3}
                            bg="rgba(45, 27, 105, 0.4)"
                            borderRadius="lg"
                            cursor="pointer"
                            border="1px solid"
                            borderColor="purple.500"
                            _hover={{
                                bg: "rgba(147, 51, 234, 0.3)",
                                borderColor: "purple.400",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 16px rgba(147, 51, 234, 0.2)"
                            }}
                            transition="all 0.2s"
                            zIndex={2}
                        >
                            <SettingsIcon color="white" size={20}/>
                            <Text fontSize="md" color="white" fontWeight="medium">
                                Settings
                            </Text>
                        </HStack>
                    </>
                )}

                {collapsed && (
                    <Box
                        color="white"
                        cursor="pointer"
                        maxW="32px"
                        transition="all 0.2s"
                        _hover={{
                            transform: "scale(1.1)",
                            color: "purple.200"
                        }}
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={2}
                        borderRadius="lg"
                        bg="rgba(45, 27, 105, 0.4)"
                        border="1px solid"
                        borderColor="purple.500"
                    >
                        <SettingsIcon size={20}/>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}

// ===============================================
