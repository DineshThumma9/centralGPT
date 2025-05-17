


import {Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {PlusSquareIcon, Search2Icon} from "@chakra-ui/icons";
import {useState} from "react";


const SearchBar = () => {

    const [output , setOutput] = useState("");
    const [input,setInput] = useState("");


    return (



        <InputGroup >
            <InputLeftElement pointerEvents='none'>
                <PlusSquareIcon/>
            </InputLeftElement>
            <Input justifySelf={"right"}  maxWidth={"full"} borderRadius={"40px"} type='search' placeholder='Type your Query'  />
        </InputGroup>

    )

}


export default SearchBar;
