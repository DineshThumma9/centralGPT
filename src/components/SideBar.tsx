import { Box, Divider, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";
import SideBarNav from "./SideBarNav.tsx";
import { SettingsIcon } from "@chakra-ui/icons";
import Chat from "./Chat.tsx";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const titles: string[] = [
        "WHo is Napolean Bonarparted",
        "Ringa Ring",
        "Allu Arjun Movies",
        "How to center div",
        "Kaleja"
    ];

    return (
        <Box
            w={collapsed ? "60px" : "350px"}
            transition="width 0.2s"
            bg="gray.800"
            color="white"
            h="100vh"
            p={4}
            overflow="hidden" // Prevent content overflow
        >
            <IconButton
                icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                aria-label="Toggle sidebar"
                size="sm"
                mb={4}
                onClick={() => setCollapsed(!collapsed)}
                bg="white"
                _hover={{ bg: "gray.600" }}
            />
            <VStack align="stretch" spacing={4} height="100%">
                {!collapsed && (
                    <>
                        <SideBarNav />
                        <VStack spacing={2} align="stretch" overflowY="auto" flex="1">
                            {titles.map((title) => (
                                <>
                                    <Chat title={title} key={title} />
                                    <Divider color="white" />
                                </>
                            ))}
                        </VStack>
                        <HStack justify="space-between" mt="auto">
                            <SettingsIcon />
                            <Text>Settings</Text>
                        </HStack>
                    </>
                )}
            </VStack>
        </Box>
    );
}
