import {
    Avatar,
    Button,
    IconButton,
    VStack,
    Portal,
    MenuPositioner,
    Separator,
    Text, HStack
} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "./ui/menu.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import useInitStore from "../store/initStore.ts";
import {LuPencilLine} from "react-icons/lu";
import {GithubIcon} from "lucide-react";
import {useState} from "react";
import GitDialog from "./GitDialog.tsx";

// Theme-consistent styles
const avatarButton = {
    bg: "linear-gradient(135deg, rgba(26, 10, 46, 0.6) 0%, rgba(45, 27, 61, 0.6) 100%)",
    borderRadius: "50%",
    border: "1px solid rgba(139, 69, 197, 0.15)",
    boxShadow: "0 4px 15px rgba(26, 10, 46, 0.2)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    _hover: {
        bg: "linear-gradient(135deg, rgba(139, 69, 197, 0.2) 0%, rgba(107, 70, 193, 0.2) 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 8px 25px rgba(139, 69, 197, 0.15)"
    },
    p: 0,
    minW: "auto",
    h: "40px",
    w: "40px"
};

const menuContent = {
    bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 100%)",
    borderColor: "rgba(139, 69, 197, 0.3)",
    shadow: "0 10px 40px rgba(26, 10, 46, 0.4)",
    borderRadius: "12px",
    border: "1px solid rgba(139, 69, 197, 0.2)",
    backdropFilter: "blur(20px)",
    minW: "200px"
};

const menuItem = {
    color: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    mx: 1,
    my: 1,
    _hover: {
        bg: "rgba(139, 69, 197, 0.2)",
        color: "white"
    }
};

const logoutMenuItem = {
    ...menuItem,
    _hover: {
        bg: "rgba(239, 68, 68, 0.2)",
        color: "white"
    }
};

const separator = {
    borderColor: "rgba(139, 69, 197, 0.2)",
    my: 1
};

const iconButton = {
    size: "sm" as const,
    variant: "ghost" as const,
    color: "rgba(255, 255, 255, 0.7)",
    minW: "auto"
};

const AvatarExpandable = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const {username, email} = useInitStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    const [dialog, setDialog] = useState(false);


    const handleGitDialog = () => {
        setDialog(false)
    }


    return (

        <HStack>
                    <IconButton
                        aria-label="Git Creditionals"
                        onClick={() => setDialog(true)}
                        size="md"
                        variant="ghost"
                        color="rgba(255, 255, 255, 0.7)"
                        _hover={{
                            bg: "rgba(139, 69, 197, 0.2)",
                            color: "white"
                        }}

                    >
                        <GithubIcon size={16}/>
                    </IconButton>

        <VStack gap={0}>


            <MenuRoot>
                <MenuTrigger asChild>


                    <Button {...avatarButton}>
                        <Avatar.Root
                            bg="linear-gradient(135deg, #8b45c5 0%, #6b46c1 100%)"
                            color="white">
                            <Avatar.Fallback
                                name={username || "user"}

                            />
                            <Avatar.Image/>
                        </Avatar.Root>

                    </Button>
                </MenuTrigger>

                <Portal>
                    <MenuPositioner>
                        <MenuContent {...menuContent}>
                            <MenuItem value="username" {...menuItem}>
                                <IconButton {...iconButton}>
                                    <BiUser/>
                                </IconButton>
                                <Text fontSize="sm" fontWeight="medium">
                                    {username || "User"}
                                </Text>
                            </MenuItem>

                            <Separator {...separator} />

                            <MenuItem value="email" {...menuItem}>
                                <Text fontSize="xs" color="rgba(255, 255, 255, 0.7)" pl={6}>
                                    {email || "No email"}
                                </Text>
                            </MenuItem>

                            <Separator {...separator} />

                            <MenuItem value="customize" {...menuItem}>
                                <IconButton {...iconButton}>
                                    <BiCog/>
                                </IconButton>
                                <Text fontSize="sm">Customize</Text>
                            </MenuItem>

                            <MenuItem value="logout" {...logoutMenuItem} onClick={handleLogout}>
                                <IconButton
                                    {...iconButton}
                                    color="rgba(239, 68, 68, 0.8)"
                                >
                                    <BiLogOut/>
                                </IconButton>
                                <Text fontSize="sm">Logout</Text>
                            </MenuItem>
                        </MenuContent>
                    </MenuPositioner>
                </Portal>
            </MenuRoot>

            {
                dialog &&

                <GitDialog
                    onCancel={() => setDialog(false)}
                    onConfirm={handleGitDialog}
                />
            }
        </VStack>
        </HStack>
    );
};

export default AvatarExpandable;