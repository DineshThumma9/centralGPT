import {HStack, MenuIcon} from "@chakra-ui/react";
import {AddIcon, Search2Icon} from "@chakra-ui/icons";
import {BsMenuButtonFill, BsMenuDown} from "react-icons/bs";


const SideBarNav = () => {


    return (

        <HStack width = "100%" >
            <AddIcon />
            <Search2Icon/>
            <BsMenuDown/>
        </HStack>

    )
}


export  default SideBarNav