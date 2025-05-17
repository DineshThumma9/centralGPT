import { Button, Menu, Portal } from "@chakra-ui/react"

const AvatorExpandable = () => {



  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">


            </Menu.Item>
            <Menu.Item value="new-file">Customize</Menu.Item>
            <Menu.Item value="new-win">Settings</Menu.Item>
            <Menu.Item value="open-file">Log</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )



}

export default AvatorExpandable