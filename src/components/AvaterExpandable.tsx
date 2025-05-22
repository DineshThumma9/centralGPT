import {Avatar, Divider, Menu, MenuButton, MenuItem, MenuList, VStack} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import Pc from "../assets/img.png";
import {useAuth} from "../hooks/useAuth.ts";
import {useAuthStore} from "../store/authStore.ts";

const AvaterExpandable = () => {

    const logout = useAuthStore(s=>s.logout)

    return (
        <VStack>
            <Menu>
                <MenuButton as={Avatar} name="Sasuke Uchiha" src={Pc} cursor="pointer"/>
                <MenuList>
                    <MenuItem _hover = "green.100" icon={<BiUser/>}>Roronora Zoror</MenuItem>
                    <Divider/>
                    <MenuItem icon={<BiCog/>}>Customize</MenuItem>
                    <MenuItem icon={<BiLogOut/>} onClick = {logout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </VStack>
    );
};

export default AvaterExpandable;