import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
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
            <VStack alignSelf="center" spacing={4} height={"100vh"}>
                {!collapsed && (
                    <>
                        <SideBarNav />
                        <VStack>
                            {titles.map((title) => (
                                <Chat title={title} key={title} />
                            ))}
                        </VStack>
                        <HStack>
                            <SettingsIcon />
                            <Text>Settings</Text>
                        </HStack>
                    </>
                )}
            </VStack>
        </Box>
    );
}