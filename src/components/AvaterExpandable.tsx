import {Avatar, Button, Menu, MenuPositioner, Portal, Separator, VStack} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import useInitStore from "../store/initStore.ts";

const AvatarExpandable = () => {
    const {logout} = useAuth();
    const navigate = useNavigate()
    const {username, email} = useInitStore()
    return (
        <VStack>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        p={0}
                        border="0px"
                        bg="transparent"
                        _hover={{
                            borderRadius: "full",
                            bg: "transparent",
                            boxShadow: "none",
                        }}
                        _focus={{
                            boxShadow: "none",
                        }}
                        zIndex={2}
                    >
                        <Avatar.Root size="sm" border="0px">
                            <Avatar.Fallback name={username || "user"}/>
                            <Avatar.Image
                                zIndex={2}
                                borderRadius="full"
                                _hover={{
                                    borderRadius: "full",
                                }}
                            />
                        </Avatar.Root>
                    </Button>
                </Menu.Trigger>

                <Portal>
                    <MenuPositioner>
                        <Menu.Content>
                            <Menu.Item value="profile">
                                <BiUser style={{marginRight: 8}}/>
                                {username}
                            </Menu.Item>
                            <Separator/>
                            <Menu.Item value="profile">
                                {email}
                            </Menu.Item>
                            <Menu.Item value="customize">
                                <BiCog style={{marginRight: 8}}/>
                                Customize
                            </Menu.Item>
                            <Menu.Item value="logout" onClick={() => {


                                logout()
                                navigate("/login")
                            }

                            }>
                                <BiLogOut style={{marginRight: 8}}/>
                                Logout

                            </Menu.Item>
                        </Menu.Content>
                    </MenuPositioner>
                </Portal>
            </Menu.Root>
        </VStack>
    );
};

export default AvatarExpandable;
