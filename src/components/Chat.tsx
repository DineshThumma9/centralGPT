import {
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded, BiEdit, BiShare, BiTrash } from "react-icons/bi";

interface Props {
    title: string;
}

const Chat = ({ title }: Props) => {
    return (
        <HStack
            justifyContent="space-between"
            w="100%"
            p={1}
            _hover={{
                bg: "surface.tertiary",
                borderColor: "app.accent",
                transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease-in-out"
            cursor="pointer"
        >
            <Text
                isTruncated
                color="app.text.primary"
                fontSize="sm"
                fontWeight="medium"
                flex="1"
            >
                {title}
            </Text>

            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<BiDotsVerticalRounded />}
                    variant="ghost"
                    aria-label="More Options"
                    size="sm"
                    color="app.text.secondary"
                    _hover={{
                        bg: "surface.tertiary",
                        color: "app.accent",
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
                <MenuList
                    bg="app.card.bg"
                    borderColor="app.border"
                    shadow="lg"
                >
                    <MenuItem
                        icon={<BiEdit />}
                        _hover={{ bg: "surface.tertiary" }}
                        color="app.text.primary"
                    >
                        Change Title
                    </MenuItem>
                    <MenuItem
                        icon={<BiTrash />}
                        _hover={{ bg: "red.600" }}
                        color="app.text.primary"
                    >
                        Delete
                    </MenuItem>
                    <MenuItem
                        icon={<BiShare />}
                        _hover={{ bg: "surface.tertiary" }}
                        color="app.text.primary"
                    >
                        Share
                    </MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    );
};

export default Chat;