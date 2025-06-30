import {HStack, IconButton} from "@chakra-ui/react";
import {Plus} from "lucide-react";
import useSessions from "../hooks/useSessions.ts";
import {useState} from "react";
import {iconButton} from "../theme/iconButton.ts";


const hstack = {
    width: "100%",
    // bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    justifyContent: "space-between",
    height: "50px",
    px: 3,
    border: "1px solid rgba(139, 69, 197, 0.1)",
    boxShadow: "0 4px 20px rgba(139, 69, 197, 0.1)",

}


// const hstackplus = {
//     "arialabel": "Create new chat",
//     variant: "ghost",
//     size: "sm",
//     borderRadius: "full",
//     bg: "linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)",
//     color: "white",
//     _hover: {
//         bg: "linear-gradient(135deg, #9f4fd9 0%, #7c3aed 100%)",
//         transform: "scale(1.05)",
//         boxShadow: "0 6px 20px rgba(139, 69, 197, 0.3)"
//     },
//     _active: {
//         transform: "scale(0.95)"
//     },
//     transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
// }
//
// const hstackseach = {
//     "aria-label": "Search chats",
//     variant: "ghost",
//     size: "sm",
//     borderRadius: "full",
//     color: "rgba(139, 69, 197, 0.8)",
//     bg: "rgba(139, 69, 197, 0.1)",
//     _hover: {
//         bg: "rgba(139, 69, 197, 0.2)",
//         color: "#8b45c5",
//         transform: "scale(1.05)",
//         boxShadow: "0 4px 15px rgba(139, 69, 197, 0.2)"
//     },
//     _active: {
//         transform: "scale(0.95)"
//     },
//     transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//     p: 2,
// }


const SideBarNav = () => {
    const {createNewSession} = useSessions();
    const [isCreating, setIsCreating] = useState(false);


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
            {...hstack}
        >
            <IconButton
                recipe={iconButton}
                onClick={handleCreateNewSession}
                loading={isCreating}
                disabled={isCreating}
                p={2}
            >
                <Plus size={18}/>
            </IconButton>


        </HStack>
    );
};

export default SideBarNav;