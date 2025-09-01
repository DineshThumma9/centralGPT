import {Avatar, Button, HStack, IconButton, MenuPositioner, Portal, Separator, Text, VStack} from "@chakra-ui/react";
import {BiLogOut, BiUser} from "react-icons/bi";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "./ui/menu.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import useInitStore from "../store/initStore.ts";
import {GitBranch} from "lucide-react";
import {ColorModeToggle} from "./ColorModeToggle";
import {useState} from "react";
import GitDialog from "./GitDialog.tsx";

const AvaterExpandable = () => {

    const avatarButton = {
        bg: "bg.panel",
        borderRadius: "50%",
        border: "1px solid",
        borderColor: "border.subtle",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
            bg: "bg.subtle",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            borderColor: { base: "brand.700", _dark: "brand.600" }
        },
        _active: {
            transform: "translateY(0px)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
        },
        p: 0,
        minW: "auto",
        h: "40px",
        w: "40px"
    };

    const menuContent = {
        bg: "bg.panel",
        borderColor: "border.subtle",
        shadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        border: "1px solid",
        backdropFilter: "blur(20px)",
        minW: "200px"
    };

    const menuItem = {
        color: "fg.default",
        borderRadius: "8px",
        mx: 2,
        my: 1,
        px: 3,
        py: 2,
        minH: "40px",
        transition: "all 0.2s ease",
        _hover: {
            bg: { base: "gray.50", _dark: "gray.800" },
            color: { base: "brand.700", _dark: "brand.300" },
            transform: "translateX(2px)"
        }
    };

    const logoutMenuItem = {
        ...menuItem,
        transition: "all 0.2s ease",
        _hover: {
            bg: { base: "red.500", _dark: "red.600" },
            color: "white",
            transform: "translateX(2px)"
        }
    };

    const separator = {
        borderColor: "border.subtle",
        my: 1
    };

    const iconButton = {
        size: "sm" as const,
        variant: "ghost" as const,
        color: { base: "brand.700", _dark: "brand.600" },
        minW: "auto",
        mr: 3,
        bg: "transparent",
        transition: "all 0.2s ease",
        _hover: {
            bg: "transparent",
            color: { base: "brand.800", _dark: "brand.500" },
            transform: "scale(1.05)"
        }
    };

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

        <HStack pr={2}>
            <IconButton
                aria-label="Git Credentials"
                onClick={() => setDialog(true)}
                size="md"
                variant="ghost"
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
            >
                <GitBranch size={16}/>
            </IconButton>

            <ColorModeToggle/>

            <VStack gap={0}>


                <MenuRoot>
                    <MenuTrigger asChild>


                        <Button {...avatarButton}>
                            <Avatar.Root
                                bg={{ base: "brand.600", _dark: "brand.700" }}
                                color="white"
                                borderRadius="50%"
                                size="sm"
                            >
                                <Avatar.Fallback
                                    name={username || "user"}
                                    fontWeight="600"
                                    fontSize="sm"
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
                                    <Text fontSize="sm" fontWeight="medium" flex="1">
                                        {username || "User"}
                                    </Text>
                                </MenuItem>

                                <Separator {...separator} />

                                <MenuItem value="email" {...menuItem}>
                                    <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }} pl={10} flex="1">
                                        {email || "No email"}
                                    </Text>
                                </MenuItem>

                                <Separator {...separator} />


                                <MenuItem value="logout" {...logoutMenuItem} onClick={handleLogout}>
                                    <IconButton
                                        {...iconButton}
                                        color={{ base: "red.600", _dark: "red.400" }}
                                        _hover={{
                                            color: "white",
                                            transform: "scale(1.05)"
                                        }}
                                    >
                                        <BiLogOut/>
                                    </IconButton>
                                    <Text fontSize="sm" flex="1">Logout</Text>
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

export default AvaterExpandable;