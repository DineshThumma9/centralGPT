import { Box, Divider, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import SideBarNav from "./SideBarNav.tsx";
import { SettingsIcon } from "@chakra-ui/icons";
import Chat from "./Chat.tsx";
import useSessions from "../hooks/useSessions.ts";
import sessionStore from "../store/sessionStore.ts";
import type Session from "../entities/Session.ts"
interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapse }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const {getSessions} = useSessions()
    const sessions : Session[] = sessionStore.getState().sessions


    const handleToggle = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        onCollapse?.(newCollapsed);
    };

    useEffect(() => {
        onCollapse?.(collapsed);
    }, []);



    useEffect(() => {
        getSessions()
    }, []);

    return (
        <Box
            w={collapsed ? "60px" : "350px"}
            transition="all 0.3s ease-in-out"
            bg="app.sidebar.bg"
            color="app.text.primary"
            h="100vh"
            p={4}
            overflow="hidden"
            borderRight="1px solid"
            borderColor="app.border"
            position="relative"
        >
            <IconButton
                icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
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
                        <SideBarNav />
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
                            {sessions.map((session) => (
                                <Box key={session.id}>
                                    <Chat title={session.title} />
                                </Box>
                            ))}
                        </VStack>

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
                            _hover={{ transform: "scale(1.1)" }}
                            transition="transform 0.2s"
                        />
                    </VStack>
                )}
            </VStack>
        </Box>
    );
}