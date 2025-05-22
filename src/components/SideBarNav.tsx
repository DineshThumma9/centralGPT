import {Flex, HStack} from "@chakra-ui/react";
import {AddIcon, Search2Icon} from "@chakra-ui/icons";
import {BsMenuDown} from "react-icons/bs";


const SideBarNav = () => {


    return (

        <HStack width="100%" justifyContent="space-between" px={2}>
            <AddIcon />
            <Search2Icon />
            <BsMenuDown />
        </HStack>

    )
}


export  default SideBarNav
