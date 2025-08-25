// src/components/MenuHelper.tsx
import {Button, Menu, MenuPositioner, Portal} from "@chakra-ui/react";
import {MenuTrigger} from "./ui/menu.tsx";
import {ChevronDownIcon} from "lucide-react";
import { useColorMode } from "../contexts/ColorModeContext";

interface Props {
    title: string
    options: string[]
    onSelect: (selected: string) => void
    selected?: string
    disabled?: boolean
}


const MenuHelper = ({title, options, onSelect, selected, disabled}: Props) => {
    const { colors } = useColorMode();

    const buttonStyles = {
        bg: colors.background.card,
        borderColor: colors.border.default,
        color: colors.text.primary,
        _hover: {
            bg: colors.background.hover,
            borderColor: colors.border.hover
        }
    };

    const contentStyles = {
        bg: colors.background.card,
        borderColor: colors.border.default,
        boxShadow: `0 4px 12px ${colors.background.body}`
    };

    const itemStyles = {
        color: colors.text.primary,
        _hover: {
            bg: colors.background.hover
        }
    };

    return (
        <Menu.Root>
            <MenuTrigger asChild>
                <Button {...buttonStyles} disabled={disabled}>
                    {selected?.slice(0,25) || title}
                    <ChevronDownIcon/>
                </Button>
            </MenuTrigger>

            <Portal>
                <MenuPositioner>
                    <Menu.Content {...contentStyles}>
                        {options.map((option) => (
                            <Menu.Item
                                value={option}
                                key={option}
                                {...itemStyles}
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
