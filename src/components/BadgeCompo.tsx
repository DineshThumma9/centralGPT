import {Badge} from "@chakra-ui/react";
import { memo } from "react";
import {badgeRecipe} from "../theme/BadgeTheme.ts";

interface Props {
    label: string;
}





const BadgeCompo = memo(({label}: Props) => {
    return (
        <Badge
            recipe={badgeRecipe}
        >
            {label.slice(0,25)}
        </Badge>
    );
});

BadgeCompo.displayName = "BadgeCompo";

export default BadgeCompo;