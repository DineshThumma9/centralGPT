import {HStack, IconButton} from "@chakra-ui/react";
import {Plus} from "lucide-react";
import useSessions from "../hooks/useSessions.ts";
import {useState} from "react";


const SideBarNav = () => {
    const {createNewSession} = useSessions();
    const [isCreating, setIsCreating] = useState(false);

    const hstackStyles = {
        width: "100%",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        justifyContent: "space-between",
        height: "50px",
        px: 3,
        border: "1px solid",
        borderColor: "border.muted",
        boxShadow: "md",
    };


    const handleCreateNewSession = async () => {
        if (isCreating) return;

        setIsCreating(true);
        try {
            const sessionId = await createNewSession();
            console.log("New session created:", sessionId);
        } catch (error) {
            console.error("Failed to create new session:", error);
        } finally {
            setIsCreating(false);
        }
    };


    return (
        <HStack
            {...hstackStyles}
        >
            <IconButton
                onClick={handleCreateNewSession}
                loading={isCreating}
                disabled={isCreating}
                p={2}
                variant="ghost"
                size="sm"
                bg="transparent"
                color={{ base: "brand.700", _dark: "brand.600" }}
                transition="all 0.2s ease"
                _hover={{
                    bg: { base: "brand.50", _dark: "brand.950" },
                    color: { base: "brand.800", _dark: "brand.500" },
                    transform: "scale(1.05)"
                }}
                _active={{
                    bg: { base: "brand.100", _dark: "brand.900" },
                    transform: "scale(0.95)"
                }}
                _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed"
                }}
            >
                <Plus size={18}/>
            </IconButton>


        </HStack>
    );
};

export default SideBarNav;