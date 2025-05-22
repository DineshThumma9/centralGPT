import {Box, HStack, IconButton, Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {Search2Icon} from "@chakra-ui/icons";
import {FaPaperPlane} from "react-icons/fa";
import {useState} from "react";


const SendRequest = () => {

    const [input,setInput] = useState("")
    const sendStreamMessage= () => {}

    return (


              <Box w="full" p={4} bg="white" borderTop="1px solid #eee">
                <HStack alignItems="center">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Search2Icon color="gray.300"/>
                        </InputLeftElement>
                        <Input
                            borderRadius="40px"
                            type="search"
                            placeholder="Type your query"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </InputGroup>
                    <IconButton
                        aria-label="Send"
                        icon={<FaPaperPlane/>}
                        colorScheme="blue"
                        onClick={sendStreamMessage}
                    />
                </HStack>
            </Box>
    )





}

export default SendRequest