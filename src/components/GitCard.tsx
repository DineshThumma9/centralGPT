import {Button, Card, Field, HStack, Input, InputGroup, Stack, VStack} from "@chakra-ui/react"
import {useState} from "react";


const GitCard = () => {


   const [owner,setOwner]=useState("")
    const [repo,setRepo] = useState("")
    const [branch,setBranch] = useState("")
    const [commit,setCommit] = useState("")



    return (
        <>
            {/*<Card.Root maxW="sm">*/}
                <VStack color={"transparent"}  pt={"2px"} pb={"2px"}  >
                    <InputGroup startAddon="https://" endAddon=".git" color={"transparent"}>
                        <Input
                            color={"transparent"}
                            placeholder="username/repo-name"

                        />
                    </InputGroup>
                    <HStack gap="4" w="full" pt={"2px"} pb={"2px"} >
                        <Field.Root  color={"white"}>
                            <Field.Label>Owner</Field.Label>
                            <Input
                                    placeholder={"username"}
                                    value={owner}
                                    color={"white"}
                                    onChange={(e)=>setOwner(e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root  color={"white"}>
                            <Field.Label>Repoistory</Field.Label>
                            <Input placeholder={"repo-name"}
                                   value={repo}
                                    color={"white"}
                                   onChange={(e)=>setRepo(e.target.value)}
                            />
                        </Field.Root>
                    </HStack>
                    <HStack gap="4" w="full"  pt={"2px"} pb={"2px"} >
                        <Field.Root   color={"white"}>
                            <Field.Label>Commit</Field.Label>
                            <Input
                                value={commit}
                                placeholder={"commit"}
                                 color={"white"}
                                onChange={(e)=>setCommit(e.target.value)}
                            />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label  color={"white"}>Branch</Field.Label>
                            <Input
                                placeholder={"main"}
                                value={branch}
                                 color={"white"}
                                onChange={(e)=>setBranch(e.target.value)}
                            />
                        </Field.Root>
                    </HStack>
                </VStack>
            {/*</Card.Root>*/}
        </>

    )
}


export default GitCard;


