import { HStack, IconButton, createToaster } from "@chakra-ui/react";
import {Plus, Search } from "lucide-react";
import useSessions from "../hooks/useSessions.ts";
import { useState } from "react";

// Create toaster instance
const toaster = createToaster({
    placement: "top",
});

const SideBarNav = () => {
    const { createNewSession } = useSessions();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateNewSession = async () => {
        if (isCreating) return;

        setIsCreating(true);
        try {
            const sessionId = await createNewSession();
            toaster.create({
                title: "New chat created",
                description: "Ready to start chatting!",
                duration: 2000,
            });
            console.log("New session created:", sessionId);
        } catch (error) {
            console.error("Failed to create new session:", error);
            toaster.create({
                title: "Error",
                description: "Failed to create new chat session",
                duration: 3000,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleSearch = () => {
        toaster.create({
            title: "Coming Soon",
            description: "Search functionality will be available soon",
            duration: 2000,
        });
    };

    return (
        <HStack width="100%"  bg = "white"  borderRadius = "40px"  justifyContent="space-between" height = "50px" px={2}>
            <IconButton
                aria-label="Create new chat"
                variant="ghost"
                size="sm"
                borderRadius={"full"}
                bg={"white"}
                color="blackAlpha.900"
                css={{
                    "&:hover": {
                        bg: "var(--chakra-colors-app-accent)",
                        color: "white",
                        transform: "scale(1.05)"
                    },
                    "&:active": {
                        transform: "scale(0.95)"
                    },
                    transition: "all 0.2s"
                }}
                onClick={handleCreateNewSession}
                loading={isCreating}
            >
                <Plus />
            </IconButton>

            <IconButton
                aria-label="Search chats"
                variant="ghost"
                size="sm"
                borderRadius={"full"}
                color="black"
                css={{
                    "&:hover": {
                        bg: "var(--chakra-colors-surface-tertiary)",
                        color: "var(--chakra-colors-app-accent)",
                        transform: "scale(1.05)"
                    },
                    "&:active": {
                        transform: "scale(0.95)"
                    },
                    transition: "all 0.2s"
                }}
                onClick={handleSearch}
            >
                <Search />
            </IconButton>
        </HStack>
    );
};

export default SideBarNav;