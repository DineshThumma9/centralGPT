import {Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {PlusSquareIcon} from "@chakra-ui/icons";


const SearchBar = () => {

    return (


        <InputGroup>
            <InputLeftElement pointerEvents='none'>
                <PlusSquareIcon/>
            </InputLeftElement>
            <Input justifySelf={"right"} maxWidth={"full"} borderRadius={"40px"} type='search'
                   placeholder='Type your Query'/>
        </InputGroup>

    )

}


export default SearchBar;
