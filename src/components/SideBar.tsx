// src/components/SideBar.tsx
import {Box, Button, Stack, Text, VStack} from "@chakra-ui/react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {useEffect, useState} from "react";
import SideBarNav from "./SideBarNav";
import SessionComponent from "./SessionComponent";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore";
import type {Session} from "../entities/Session";
import { useColorMode } from "../contexts/ColorModeContext";

interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({onCollapse}: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { colors } = useColorMode();

    // ✅ Directly use Zustand selectors
    const sessions = sessionStore((s) => s.sessions);
    const currentSession = sessionStore((s) => s.current_session);
    const isLoading = sessionStore((s) => s.isLoading);

    const {getSessions, selectSession} = useSessions();

    const boxStyles = {
        transition: "all 0.3s ease-in-out",
        bg: colors.background.card,
        color: colors.text.primary,
        h: "100vh",
        p: 3,
        overflow: "hidden",
        borderRight: `1px solid ${colors.border.default}`,
        position: "relative" as const,
        boxShadow: `2px 0 8px ${colors.shadow.sm}`,
    };

    const collapsibleButtonStyles = {
        bg: colors.text.primary,
        color: colors.background.primary,
        border: "2px solid",
        borderColor: colors.border.default,
        _hover: {
            bg: colors.text.secondary,
            transform: "scale(1.05)",
            borderColor: colors.border.hover,
        },
        _active: {
            transform: "scale(0.95)",
        },
        transition: "all 0.2s",
        size: "sm" as const,
        mb: 4,
        borderRadius: "full"
    };

    const stackStyles = {
        gap: 3,
        align: "stretch" as const,
        overflowY: "auto" as const,
        flex: "1",
        pr: 2,
    };

    const sessionStackStyles = {
        borderRadius: "lg",
        padding: "2px",
        margin: "0",
        transition: "all 0.2s ease-in-out"
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
                    bg={isActive ? colors.background.active : "transparent"}
                    border={isActive ? "1px solid" : "1px solid transparent"}
                    borderColor={isActive ? colors.border.focus : "transparent"}
                    borderRadius="22px"
                >
                    <SessionComponent
                        bg={isActive ? colors.background.hover : colors.background.card}
                        color={colors.text.primary}
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
                                    <Text fontSize="sm" color={colors.text.muted} textAlign="center">
                                        Loading sessions...
                                    </Text>
                                </Box>
                            )}

                            {!isLoading && sessions.length === 0 && (
                                <Box p={4}>
                                    <Text fontSize="sm" color={colors.text.secondary} textAlign="center" lineHeight="1.6">
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