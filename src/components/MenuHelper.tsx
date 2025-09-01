// src/components/MenuHelper.tsx
import {Button, Menu, MenuPositioner, Portal} from "@chakra-ui/react";
import {MenuTrigger} from "./ui/menu.tsx";
import {ChevronDownIcon} from "lucide-react";
import {useRef, useEffect} from "react";

interface Props {
    title: string
    options: string[]
    onSelect: (selected: string) => void
    onDoubleClick?: (selected: string) => void
    selected?: string
    disabled?: boolean
}


const MenuHelper = ({title, options, onSelect, onDoubleClick, selected, disabled}: Props) => {
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
            }
        };
    }, []);

    const handleItemClick = (option: string) => {
        if (!onDoubleClick) {
            // If no double-click handler, just do single click
            onSelect(option);
            return;
        }

        if (clickTimeoutRef.current) {
            // This is a double-click
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            onDoubleClick(option);
        } else {
            // This might be a single-click, wait to see if there's another click
            clickTimeoutRef.current = setTimeout(() => {
                onSelect(option);
                clickTimeoutRef.current = null;
            }, 300); // 300ms delay to detect double-click
        }
    };

    return (
        <Menu.Root>
            <MenuTrigger asChild>
                <Button css={{ menuHelper: {} }} disabled={disabled}>
                    {selected?.slice(0, 25) || title}
                    <ChevronDownIcon/>
                </Button>
            </MenuTrigger>

            <Portal>
                <MenuPositioner>
                    <Menu.Content 
                        bg="bg.surface"
                        borderColor="border.default"
                        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                    >
                        {options.map((option) => (
                            <Menu.Item
                                value={option}
                                key={option}
                                color="fg.default"
                                _hover={{ 
                                    bg: { base: "brand.50", _dark: "brand.950" },
                                    color: { base: "brand.800", _dark: "white" }
                                }}
                                onClick={() => handleItemClick(option)}
                                cursor={onDoubleClick ? "pointer" : "default"}
                                title={onDoubleClick ? "Double-click to view documentation" : undefined}
                                transition="all 0.2s ease"
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
