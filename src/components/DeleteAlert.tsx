import { Button, CloseButton, Dialog, Flex, IconButton, Portal } from "@chakra-ui/react"
import {Trash} from "lucide-react";
import {MenuItem} from "./ui/menu.tsx";


interface Props{
    onCancel : () => void;
    onConfirm:() => void

}
const DeleteAlert = ({onConfirm,onCancel}:Props) => {
  return (
    <Dialog.Root role="alertdialog" open = {true}>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content colorScheme={"black"}>
            <Dialog.Header color={"black"} >
              <Dialog.Title>Are you sure?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body color ="black">
              <p>
                This action cannot be undone. This will permanently delete your session
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick = {onConfirm}>Delete</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm"  onClick={onCancel}/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}


export default DeleteAlert;