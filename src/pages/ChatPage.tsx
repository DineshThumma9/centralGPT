import { Flex } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea.tsx";

export default function ChatPage() {
  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar />
      <ChatArea />
    </Flex>
  );
}
