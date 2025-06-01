import {Button, Menu, MenuPositioner, Portal} from "@chakra-ui/react";
import {MenuTrigger} from "./ui/menu.tsx";
import {ChevronDownIcon} from "lucide-react";



interface Props{
    title:string
    options:string[]
    onSelect:(selected:string) => void
    selected?:string
    disabled?:boolean


}

const MenuHelper = ({title,options,onSelect,selected,disabled}:Props) => {




    return (
         <Menu.Root>
                <MenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        color="black"
                        bg={"white"}
                        disabled = {disabled}
                        _hover={{
                            color: "app.border",
                            borderColor: "app.text.primary",
                        }}

                    >
                        <ChevronDownIcon/>
                        {selected|| title}
                    </Button>
                </MenuTrigger>


                <Portal>
                    <MenuPositioner>
                        <Menu.Content
                            bg="app.card.bg"
                            borderColor="app.border"
                        >
                            {options.map((option) => (
                                <Menu.Item
                                    value={option}
                                    key={option}
                                    onClick={() => onSelect(option)}
                                    _hover={{bg: "surface.tertiary"}}
                                    color="app.text.primary"
                                    textTransform="capitalize"
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


export default MenuHelper