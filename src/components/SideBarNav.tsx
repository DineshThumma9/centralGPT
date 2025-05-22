import {Flex, HStack} from "@chakra-ui/react";
import {AddIcon, Search2Icon} from "@chakra-ui/icons";
import {BsMenuDown} from "react-icons/bs";


const SideBarNav = () => {


    return (

        <HStack width = "80%"  justifyContent={"space-between"} >
            <AddIcon />
            <Search2Icon/>
            <BsMenuDown/>
        </HStack>

    )
}


export  default SideBarNav