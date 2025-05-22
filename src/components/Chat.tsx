import {HStack, IconButton, Text, useColorMode} from "@chakra-ui/react";
import {useState} from "react";
import {BiDotsVerticalRounded} from "react-icons/bi";


interface Props{
    title:string
}

const Chat = ({title}:Props) => {




    return (
        <HStack justifyContent = "space-between" borderRadius={"40"} border={"gray"} >

            <Text>{title}</Text>
            <IconButton
                icon={<BiDotsVerticalRounded/>}
                variant="ghost"
                aria-label="More options"
            />
        </HStack>
    )
}

export default Chat