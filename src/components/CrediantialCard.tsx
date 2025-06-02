import {Card, CardBody, CardFooter, CardHeader, Heading, Stack} from "@chakra-ui/react";
import  {type ReactNode} from "react";
import NavGateButton from "./NavGateButton.tsx";


interface Props {
    heading: string,
    children: ReactNode
    login_register: string
    message: string
    isLoading: boolean
    onSubmit: () => void
    altlink: string
}

const CrediantialCard = ({heading, login_register, children, message, isLoading, onSubmit, altlink}: Props) => {

    return (
        <Card.Root


            w="full"
            // bg={"white"}
            boxShadow="lg"
            borderRadius="xl"
            p={6}
        >

            <CardHeader width={"sm"}>
                <Heading as="h1" size="lg" textAlign="center">
                    {heading}
                </Heading>
            </CardHeader>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}>

            <CardBody width={"sm"}>

                <Stack p={2}>

                    {children}

                </Stack>

            </CardBody>



            <CardFooter>
                <NavGateButton login_register={login_register} message={message} isLoading={isLoading}
                               onSubmit={onSubmit} altlink={altlink}/>
            </CardFooter>
                 </form>
        </Card.Root>

    )
}

export default CrediantialCard;