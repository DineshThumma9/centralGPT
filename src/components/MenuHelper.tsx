// src/components/MenuHelper.tsx
import {Button, Menu, MenuPositioner, Portal, useSlotRecipe} from "@chakra-ui/react";
import {MenuTrigger} from "./ui/menu.tsx";
import {ChevronDownIcon} from "lucide-react";

interface Props {
    title: string
    options: string[]
    onSelect: (selected: string) => void
    selected?: string
    disabled?: boolean
}


const MenuHelper = ({title, options, onSelect, selected, disabled}: Props) => {
    // Use useSlotRecipe for slot recipes, not useRecipe
    const recipe = useSlotRecipe({key: "menuHelper"});
    const styles = recipe();

    return (
        <Menu.Root>
            <MenuTrigger asChild>
                <Button css={styles.button} disabled={disabled}>
                    {selected?.slice(0,25) || title}
                    <ChevronDownIcon/>
                </Button>
            </MenuTrigger>

            <Portal>
                <MenuPositioner>
                    <Menu.Content css={styles.content}>
                        {options.map((option) => (
                            <Menu.Item
                                value={option}
                                key={option}
                                css={styles.item}
                                onClick={() => onSelect(option)}
                            >
                                {option.split("-")}
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </MenuPositioner>
            </Portal>
        </Menu.Root>
    );
};

export default MenuHelper;
