import {Badge} from "@chakra-ui/react";
import { memo } from "react";

interface Props {
    label: string;
}

const BadgeCompo = memo(({label}: Props) => {
    return (
        <Badge
            colorScheme="brand"
            variant="subtle"
            textTransform="capitalize"
        >
            {label}
        </Badge>
    );
});

BadgeCompo.displayName = "BadgeCompo";

export default BadgeCompo;