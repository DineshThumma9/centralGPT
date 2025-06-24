import {Avatar, Button, Menu, MenuPositioner, Portal, Separator, VStack} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import useInitStore from "../store/initStore.ts";



const menuButton = {
         variant:"ghost",
                        size:"sm",
                        p:0,
                        border:"0px",
                        bg:"transparent",
                        _hover:{
                            borderRadius: "full",
                            bg: "purple.50",
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease"
                        },
                        _focus:{
                            boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.3)",
                            outline: "none"
                        },
                        _active:{
                            transform: "scale(0.95)"
                        },
                        transition:"all 0.2s ease",
                        zIndex:2
}


const avatorRoot = {
       size:"sm",
                            border:"2px solid",
                            borderColor:"purple.200",
                            _hover:{
                                borderColor: "purple.300",
                                boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)"
                            },
                            transition:"all 0.2s ease"
}


const menuContent = {

}

const menuItem = {

}
const AvatarExpandable = () => {
    const {logout} = useAuth();
    const navigate = useNavigate()
    const {username, email} = useInitStore()

    return (
        <VStack>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button
                        {...menuButton}
                    >
                        <Avatar.Root
                            {...avatorRoot}
                        >
                            <Avatar.Fallback
                                name={username || "user"}
                                bg="linear-gradient(135deg, purple.500, violet.500)"
                                color="white"
                                fontWeight="semibold"
                            />
                            <Avatar.Image
                                zIndex={2}
                                borderRadius="full"
                            />
                        </Avatar.Root>
                    </Button>
                </Menu.Trigger>

                <Portal>
                    <MenuPositioner>
                        <Menu.Content
                            bg="white"
                            border="1px solid"
                            borderColor="purple.200"
                            borderRadius="xl"
                            boxShadow="0 8px 32px rgba(147, 51, 234, 0.15)"
                            p={2}
                            minW="200px"
                        >
                            <Menu.Item
                                value="profile"
                                _hover={{
                                    bg: "purple.50",
                                    borderRadius: "lg"
                                }}
                                px={3}
                                py={2}
                                color="purple.700"
                                fontWeight="medium"
                            >
                                <BiUser style={{marginRight: 8, color: "#8B5CF6"}}/>
                                {username}
                            </Menu.Item>

                            <Separator
                                borderColor="purple.100"
                                my={1}
                            />

                            <Menu.Item
                                value="email"
                                px={3}
                                py={2}
                                color="gray.600"
                                fontSize="sm"
                                cursor="default"
                                _hover={{}}
                            >
                                {email}
                            </Menu.Item>

                            <Menu.Item
                                value="customize"
                                _hover={{
                                    bg: "purple.50",
                                    borderRadius: "lg"
                                }}
                                px={3}
                                py={2}
                                color="purple.700"
                                fontWeight="medium"
                            >
                                <BiCog style={{marginRight: 8, color: "#8B5CF6"}}/>
                                Customize
                            </Menu.Item>

                            <Separator
                                borderColor="purple.100"
                                my={1}
                            />

                            <Menu.Item
                                value="logout"
                                onClick={() => {
                                    logout()
                                    navigate("/login")
                                }}
                                _hover={{
                                    bg: "red.50",
                                    borderRadius: "lg"
                                }}
                                px={3}
                                py={2}
                                color="red.600"
                                fontWeight="medium"
                            >
                                <BiLogOut style={{marginRight: 8, color: "#DC2626"}}/>
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