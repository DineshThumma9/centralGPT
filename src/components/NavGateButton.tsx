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
    flexDirection: "column" as const,
    alignItems: "stretch",
    gap: 4,
    width: "100%",
}

const submitButtonStyles = {
    bg: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    color: "white",
    border: "1px solid",
    borderColor: "purple.400",
    _hover: {
        bg: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
        transform: "scale(1.02)",
        boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)"
    },
    _active: {
        transform: "scale(0.98)",
    },
    transition: "all 0.2s",
    boxShadow: "0 4px 16px rgba(147, 51, 234, 0.3)",
    fontWeight: "bold",
    py: 3,
    borderRadius: "lg"
}

const outlineButtonStyles = {
    bg: "transparent",
    color: "white",
    border: "1px solid",
    borderColor: "rgba(147, 51, 234, 0.5)",
    _hover: {
        bg: "rgba(147, 51, 234, 0.1)",
        borderColor: "purple.400",
        transform: "scale(1.02)",
    },
    _active: {
        transform: "scale(0.98)",
    },
    transition: "all 0.2s",
    fontWeight: "medium",
    py: 3,
    borderRadius: "lg",
    width: "100%"
}

const NavGateButton = ({login_register, message, isLoading, onSubmit, altlink}: Props) => {
    return (
        <ButtonGroup {...buttonGroup}>
            <Button
                onClick={() => onSubmit()}
                loading={isLoading}
                {...submitButtonStyles}
            >
                {login_register}
            </Button>

            <Separator
                borderColor="rgba(147, 51, 234, 0.3)"
                my={2}
            />

            <Link to={altlink} style={{width: "100%"}}>
                <Button {...outlineButtonStyles}>
                    {message}
                </Button>
            </Link>
        </ButtonGroup>
    )
}

export default NavGateButton