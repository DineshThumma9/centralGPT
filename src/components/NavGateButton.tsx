import {Button, ButtonGroup, Separator} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import React from "react";


interface Props{
    login_register:string,
    message:string
    isLoading:boolean
    onSubmit:() => void
    altlink:string

}

const NavGateButton = ({login_register,message,isLoading,onSubmit,altlink}:Props) => {

    return (
              <ButtonGroup
                            alignSelf="start"
                            alignContent="center"
                            flexDirection="column"
                            alignItems="stretch"
                            gap={2}
                            width="100%"
                        >
                            <Button
                                colorScheme="blue"
                                type="submit"
                                width="100%"
                                onClick={() => onSubmit()}
                                loading={isLoading}
                                loadingText="Registering"
                                fontStyle={"bold"}
                                fontSize={"sm"}
                            >
                                {login_register}
                            </Button>

                            <Separator/>

                            <Link to={altlink}>
                                <Button
                                    bg={"black"}
                                    color="white"
                                    variant="outline"
                                    type="button"
                                    width="100%"
                                    transition="smooth"
                                    fontStyle={"bold"}
                                    fontSize={"md"}
                                >
                                    {message}
                                </Button>
                            </Link>
                        </ButtonGroup>
    )
}

export default NavGateButton
