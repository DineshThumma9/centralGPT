import {Flex, HStack} from "@chakra-ui/react";
import {AddIcon, Search2Icon} from "@chakra-ui/icons";
import {BsMenuDown} from "react-icons/bs";
import useSessions from "../hooks/useSessions.ts";


const SideBarNav = () => {

    const {createNewSession} = useSessions()

    return (

        <HStack width="100%" justifyContent="space-between" px={2}>
            <AddIcon onClick={createNewSession} />
            <Search2Icon />
            <BsMenuDown />
        </HStack>

    )
}


export  default SideBarNav
