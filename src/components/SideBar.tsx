import {Box, IconButton, Stack, Text, VStack} from "@chakra-ui/react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {useState} from "react";
import SideBarNav from "./SideBarNav.tsx";
import {SettingsIcon} from "@chakra-ui/icons";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      w={collapsed ? "60px" : "350px"}
      transition="width 0.2s"
      bg="gray.800"
      color="white"
      h="100vh"
      p={4}
    >
      <IconButton
        icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        aria-label="Toggle sidebar"
        size="sm"
        mb={4}
        onClick={() => setCollapsed(!collapsed)}
        bg="white"
        _hover={{ bg: "gray.600" }}
      />
      <VStack align="center" spacing={4} >

        {!collapsed && (
          <>

                 <SideBarNav />
                 <Text>New Chat</Text>
            <Text>History</Text>
            <Text>Settings</Text>
            <SettingsIcon/>



          </>
        )}
      </VStack>
    </Box>
  );
}
