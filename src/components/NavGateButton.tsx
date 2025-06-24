import {Button, ButtonGroup, Separator} from "@chakra-ui/react";
import {Link} from "react-router-dom";


interface Props {
    login_register: string,
    message: string
    isLoading: boolean
    onSubmit: () => void
    altlink: string

}


const buttonGroup = {
    alignSelf: "start",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 2,
    width: "100%",
}

const login_register_props = {

    colorScheme: "blue",
    type: "submit",
    width: "100%",
    loadingText: "Registering",
    fontStyle: "bold",
    fontSize: "sm",
}

const message_props = {
    bg: "black",
    color: "white",
    variant: "outline",
    type: "button",
    width: "100%",
    transition: "smooth",
    fontStyle: "bold",
    fontSize: "md",

}
const NavGateButton = (
    {
        login_register, message, isLoading, onSubmit, altlink
    }
    :
    Props
) => {

    return (
        <ButtonGroup
            {...buttonGroup}
        >
            <Button
                onClick={() => onSubmit()}
                loading={isLoading}
                {...login_register_props}
            >
                {login_register}
            </Button>

            <Separator/>

            <Link to={altlink}>
                <Button
                    {...message_props}
                >
                    {message}
                </Button>
            </Link>
        </ButtonGroup>
    )
}

export default NavGateButton
