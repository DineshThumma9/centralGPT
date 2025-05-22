import {Avatar, Button, Divider, Menu, Portal} from "@chakra-ui/react";
import Pc from "../assets/img.png";


const AvaterExpandable = () => {


    const [more, setMore] = useState(false)
    return (
        <>

            <Avatar name="Sasuke Uchiha" src={Pc}/>

            {moreOptions &&
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="outline" size="sm">
                            Open
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item value="zoro">Roronora Zoror</Menu.Item>
                                <Divider/>
                                <Menu.Item value="configure assitant">Customize</Menu.Item>
                                <Menu.Item value="new-win">Logout</Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>


            }

        </>

    )
}

export default AvaterExpandable;