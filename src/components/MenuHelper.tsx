// src/components/MenuHelper.tsx
import {Button, Menu, MenuPositioner, Portal} from "@chakra-ui/react";
import {MenuTrigger} from "./ui/menu.tsx";
import {ChevronDownIcon} from "lucide-react";

interface Props {
    title: string
    options: string[]
    onSelect: (selected: string) => void
    selected?: string
    disabled?: boolean
}


const menuhelperbutton = {
    variant: "outline",
    size: "sm",
    color: "white",
    bg: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    border: "1px solid",
    borderColor: "purple.400",
    _hover: {
        bg: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
        borderColor: "purple.300",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 16px rgba(147, 51, 234, 0.4)"
    },
    _active: {
        transform: "translateY(0)",
        boxShadow: "0 2px 8px rgba(147, 51, 234, 0.3)"
    },
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(147, 51, 234, 0.2)",


}


const menuContent = {
    bg: "linear-gradient(135deg, #2d1b69 0%, #1a0b2e 100%)",
    borderColor: "purple.500",
    border: "1px solid",
    borderRadius: "lg",
    boxShadow: "0 12px 40px rgba(147, 51, 234, 0.3)",
    backdropFilter: "blur(12px)",
}

const menuItem = {
    _hover: {
        bg: "rgba(147, 51, 234, 0.2)",
        color: "purple.200"
    },
    color: "white",
    textTransform: "capitalize",
    py: 3,
    px: 4,
    transition: "all 0.2s",
}



const MenuHelper = ({title, options, onSelect, selected, disabled}: Props) => {


    return (
        <Menu.Root>
            <MenuTrigger asChild>
                <Button
                    disabled={disabled}
                    {...menuhelperbutton}

                >
                    <ChevronDownIcon/>
                    {selected || title}
                </Button>
            </MenuTrigger>

            <Portal>
                <MenuPositioner>
                    <Menu.Content
                        {...menuContent}
                    >
                        {options.map((option) => (
                            <Menu.Item
                                value={option}
                                key={option}
                                onClick={() => onSelect(option)}
                                {...menuItem}
                            >
                                {option}
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </MenuPositioner>
            </Portal>
        </Menu.Root>
    )
}

export default MenuHelper;

// ===============================================
