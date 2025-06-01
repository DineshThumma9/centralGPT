import {Badge} from "@chakra-ui/react";


interface Props{
    label:string
}
const BadgeCompo = ({label}: Props) => {

    return (
        <Badge
            colorScheme="brand"
            variant="subtle"
            textTransform="capitalize"
        >
            {label}
        </Badge>
    )
}

export default BadgeCompo