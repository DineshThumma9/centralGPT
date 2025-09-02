// src/components/SideBar.tsx
import {Box, Button, Stack, Text, VStack} from "@chakra-ui/react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {useEffect, useState} from "react";
import SideBarNav from "./SideBarNav";
import SessionComponent from "./SessionComponent";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore";
interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({onCollapse}: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    // ✅ Directly use Zustand selectors
    const sessions = sessionStore((s) => s.sessions);
    const currentSession = sessionStore((s) => s.current_session);
    const isLoading = sessionStore((s) => s.isLoading);

    const {getSessions, selectSession} = useSessions();

    const boxStyles = {
        transition: "all 0.3s ease-in-out",
        bg: "bg.surface",
        color: "fg.default",
        h: "100vh",
        p: 3,
        overflow: "hidden",
        borderRight: "1px solid",
        borderRightColor: "border.default",
        position: "relative" as const,
        boxShadow: "sm",
    };

    const collapsibleButtonStyles = {
        bg: { base: "white", _dark: "gray.800" },
        color: { base: "brand.700", _dark: "brand.600" },
        border: "2px solid",
        borderColor: { base: "brand.200", _dark: "brand.700" },
        _hover: {
            bg: { base: "brand.50", _dark: "brand.950" },
            color: { base: "brand.800", _dark: "brand.500" },
            transform: "scale(1.05)",
            borderColor: { base: "brand.300", _dark: "brand.600" },
        },
        _active: {
            transform: "scale(0.95)",
            bg: { base: "brand.100", _dark: "brand.900" },
        },
        transition: "all 0.2s",
        size: "sm" as const,
        mb: 4,
        borderRadius: "full",
        boxShadow: "sm"
    };

    const stackStyles = {
        gap: 0,
        align: "stretch" as const,
        overflowY: "auto" as const,
        flex: "1",
        pr: 1,

    };

    const sessionStackStyles = {
        borderRadius: "12px",
        padding: "0px",
        margin: "0",
        transition: "all 0.2s ease",
    };

    const handleToggle = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        onCollapse?.(newCollapsed);
    };

    useEffect(() => {
        getSessions(); // ✅ Only run once on mount
    }, []);


    const handleSessionSelect = async (sessionId: string) => {
        try {
            await selectSession(sessionId);
        } catch (error) {
            console.error("Failed to select session:", error);
        }
    };

    const renderSessions = () => {
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
                    {...sessionStackStyles}
                    bg={isActive ? "bg.emphasized" : "transparent"}
                    borderRadius="12px"
                >
                    <SessionComponent
                        bg={isActive ? "bg.subtle" : "bg.surface"}
                        color="fg.default"
                        title={session.title || "New Chat"}
                        sessionId={sessionId}
                        onSelect={() => handleSessionSelect(sessionId)}
                    />
                </Stack>
            );
        });
    };

    return (
        <Box
            w={collapsed ? "50px" : "240px"}
            {...boxStyles}
        >
            <Button
                width={collapsed ? "28px" : "40px"}
                height={collapsed ? "28px" : "40px"}
                onClick={handleToggle}
                aria-label="Toggle sidebar"
                {...collapsibleButtonStyles}
            >
                {collapsed ? <FiChevronRight/> : <FiChevronLeft/>}
            </Button>

            <VStack align="stretch" gap={4} height="calc(100% - 80px)">
                {!collapsed && (
                    <>
                        <SideBarNav/>

                        <VStack {...stackStyles}>
                            {isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color="fg.muted" textAlign="center">
                                        Loading sessions...
                                    </Text>
                                </Box>
                            )}

                            {!isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color="fg.subtle" textAlign="center"
                                          lineHeight="1.6">
                                        No chat sessions yet.
                                        <br/>
                                        Create your first chat!
                                    </Text>
                                </Box>
                            )}

                            {renderSessions()}
                        </VStack>
                    </>
                )}
            </VStack>
        </Box>
    );
}