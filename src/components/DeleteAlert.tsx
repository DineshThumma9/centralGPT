import { Button, CloseButton, Dialog, Flex, IconButton, Portal } from "@chakra-ui/react"
import {Trash} from "lucide-react";
import {MenuItem} from "./ui/menu.tsx";

interface Props{
    onCancel : () => void;
    onConfirm:() => void
}




const dialogContent = {


}

const dialogTitle = {

}



const DeleteAlert = ({onConfirm, onCancel}: Props) => {
  return (
    <Dialog.Root role="alertdialog" open={true}>
      <Portal>
        <Dialog.Backdrop
          bg="rgba(10, 10, 15, 0.8)"
          backdropFilter="blur(20px)"
        />
        <Dialog.Positioner>
          <Dialog.Content
            bg="linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 100%)"
            borderRadius="20px"
            border="1px solid rgba(139, 69, 197, 0.2)"
            boxShadow="0 20px 60px rgba(139, 69, 197, 0.3)"
            backdropFilter="blur(20px)"
            maxW="md"
            mx={4}
          >
            <Dialog.Header p={6} pb={4}>
              <Dialog.Title
                fontSize="xl"
                fontWeight="bold"
                color="white"
                textAlign="center"
                bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                bgClip="text"
                css={{
                  '-webkit-background-clip': 'text',
                  '-webkit-text-fill-color': 'transparent',
                }}
              >
                Are you sure?
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body p={6} pt={2} color="rgba(255, 255, 255, 0.9)">
              <p>
                This action cannot be undone. This will permanently delete your session
                and all associated messages.
              </p>
            </Dialog.Body>
            <Dialog.Footer p={6} pt={4} gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  borderRadius="12px"
                  border="1px solid rgba(139, 69, 197, 0.3)"
                  color="rgba(255, 255, 255, 0.8)"
                  bg="transparent"
                  px={6}
                  py={2}
                  _hover={{
                    bg: "rgba(139, 69, 197, 0.1)",
                    borderColor: "rgba(139, 69, 197, 0.5)",
                    color: "white"
                  }}
                  _active={{
                    transform: "translateY(1px)"
                  }}
                  transition="all 0.2s"
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={onConfirm}
                bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                color="white"
                borderRadius="12px"
                px={6}
                py={2}
                fontWeight="medium"
                border="none"
                _hover={{
                  bg: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)"
                }}
                _active={{
                  transform: "translateY(1px)"
                }}
                transition="all 0.2s"
              >
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={onCancel}
                position="absolute"
                top={4}
                right={4}
                color="rgba(255, 255, 255, 0.6)"
                _hover={{
                  color: "#8b45c5",
                  bg: "rgba(139, 69, 197, 0.1)"
                }}
                borderRadius="8px"
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default DeleteAlert;