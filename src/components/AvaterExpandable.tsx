import {Avatar, Divider, Menu, MenuButton, MenuItem, MenuList, VStack} from "@chakra-ui/react";
import {BiCog, BiLogOut, BiUser} from "react-icons/bi";
import Pc from "../assets/img.png";

const AvaterExpandable = () => {
    return (
        <VStack>
            <Menu>
                <MenuButton as={Avatar} name="Sasuke Uchiha" src={Pc} cursor="pointer"/>
                <MenuList>
                    <MenuItem icon={<BiUser/>}>Roronora Zoror</MenuItem>
                    <Divider/>
                    <MenuItem icon={<BiCog/>}>Customize</MenuItem>
                    <MenuItem icon={<BiLogOut/>}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </VStack>
    );
};

export default AvaterExpandable;