import {Avatar, Button, Menu, MenuPositioner, Portal, VStack} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import Pc from "../assets/img.png";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";

const AvatarExpandable = () => {
    const {logout} = useAuth();
    const navigate = useNavigate()

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
                        zIndex = {2}
                    >
                        <Avatar.Root size="sm" border="0px">
                            <Avatar.Fallback name="Roronoa Zoro"/>
                            <Avatar.Image
                                zIndex ={2}
                                src={Pc}
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
                                Roronoa Zoro
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
