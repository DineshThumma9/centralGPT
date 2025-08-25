import {Avatar, Button, HStack, IconButton, MenuPositioner, Portal, Separator, Text, VStack} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "./ui/menu.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import useInitStore from "../store/initStore.ts";
import {GithubIcon} from "lucide-react";
import {ColorModeToggle} from "./ColorModeToggle";
import {useState} from "react";
import GitDialog from "./GitDialog.tsx";
import { useColorMode } from "../contexts/ColorModeContext";


const AvaterExpandable = () => {
    const { colors } = useColorMode();

    const avatarButton = {
        bg: colors.background.card,
        borderRadius: "50%",
        border: `1px solid ${colors.border.default}`,
        boxShadow: `0 4px 15px ${colors.background.body}`,
        backdropFilter: "blur(10px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
            bg: colors.background.hover,
            transform: "translateY(-1px)",
            boxShadow: `0 8px 25px ${colors.border.hover}`
        },
        p: 0,
        minW: "auto",
        h: "40px",
        w: "40px"
    };

    const menuContent = {
        bg: colors.background.card,
        borderColor: colors.border.default,
        shadow: `0 10px 40px ${colors.background.body}`,
        borderRadius: "12px",
        border: `1px solid ${colors.border.default}`,
        backdropFilter: "blur(20px)",
        minW: "200px"
    };

    const menuItem = {
        color: colors.text.primary,
        borderRadius: "8px",
        mx: 1,
        my: 1,
        _hover: {
            bg: colors.background.hover,
            color: colors.text.primary
        }
    };

    const logoutMenuItem = {
        ...menuItem,
        _hover: {
            bg: colors.text.danger,
            color: colors.text.primary
        }
    };

    const separator = {
        borderColor: colors.border.default,
        my: 1
    };

    const iconButton = {
        size: "sm" as const,
        variant: "ghost" as const,
        color: colors.text.secondary,
        minW: "auto"
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

        <HStack>
            <IconButton
                aria-label="Git Creditionals"
                onClick={() => setDialog(true)}
                size="md"
                variant="ghost"
                color={colors.text.secondary}
                _hover={{
                    bg: colors.background.hover,
                    color: colors.text.primary
                }}

            >
                <GithubIcon size={16}/>
            </IconButton>

            <ColorModeToggle />

            <VStack gap={0}>


                <MenuRoot>
                    <MenuTrigger asChild>


                        <Button {...avatarButton}>
                            <Avatar.Root
                                bg={colors.background.accent}
                                color={colors.text.primary}>
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
                                    <Text fontSize="xs" color={colors.text.secondary} pl={6}>
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
                                        color={colors.text.danger}
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

export default AvaterExpandable;