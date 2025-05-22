import {
    Avatar, Box,
    Divider,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorMode
} from "@chakra-ui/react";
import {useState} from "react";
import {BiDotsVerticalRounded, BiEdit, BiShare, BiTrash} from "react-icons/bi";
import Pc from "../assets/img.png";


interface Props{
    title:string
}

const Chat = ({title}:Props) => {

    return (
        <HStack
            justifyContent="space-between"
            borderRadius="40px"
            borderWidth="1px"
            shadow="sm"
            // borderColor="white"
            w="100%"

        >
            <Text isTruncated>{title}</Text>
            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<BiDotsVerticalRounded />}
                    variant="ghost"
                    aria-label="More Options"
                />
                <MenuList>
                    <MenuItem icon={<BiEdit />}>Change Title</MenuItem>
                    <MenuItem icon={<BiTrash />}>Delete</MenuItem>
                    <MenuItem icon={<BiShare />}>Share</MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    )
}

export default Chat
