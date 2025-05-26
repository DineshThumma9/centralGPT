import { HStack, IconButton, useToast } from "@chakra-ui/react";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import useSessions from "../hooks/useSessions.ts";
import { useState } from "react";

const SideBarNav = () => {
    const { createNewSession } = useSessions();
    const [isCreating, setIsCreating] = useState(false);
    const toast = useToast();

    const handleCreateNewSession = async () => {
        if (isCreating) return;

        setIsCreating(true);
        try {
            const sessionId = await createNewSession();
            toast({
                title: "New chat created",
                description: "Ready to start chatting!",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            console.log("New session created:", sessionId);
        } catch (error) {
            console.error("Failed to create new session:", error);
            toast({
                title: "Error",
                description: "Failed to create new chat session",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleSearch = () => {
        toast({
            title: "Coming Soon",
            description: "Search functionality will be available soon",
            status: "info",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <HStack width="100%" justifyContent="space-between" px={2}>
            <IconButton
                icon={<AddIcon />}
                aria-label="Create new chat"
                variant="ghost"
                size="sm"
                color="app.text.primary"
                _hover={{
                    bg: "app.accent",
                    color: "white",
                    transform: "scale(1.05)"
                }}
                _active={{
                    transform: "scale(0.95)"
                }}
                transition="all 0.2s"
                onClick={handleCreateNewSession}
                isLoading={isCreating}
            />

            <IconButton
                icon={<Search2Icon />}
                aria-label="Search chats"
                variant="ghost"
                size="sm"
                color="app.text.secondary"
                _hover={{
                    bg: "surface.tertiary",
                    color: "app.accent",
                    transform: "scale(1.05)"
                }}
                _active={{
                    transform: "scale(0.95)"
                }}
                transition="all 0.2s"
                onClick={handleSearch}
            />
        </HStack>
    );
};

export default SideBarNav;