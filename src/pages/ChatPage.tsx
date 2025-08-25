import {Grid, GridItem, Box, Toaster} from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import { useState } from "react";
import { useColorMode } from "../contexts/ColorModeContext";

const ChatPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { colors } = useColorMode();

    return (
        <Box
            h="100vh"
            w="100vw"
            bg={colors.background.body}
            overflow="hidden"
            position="relative"
        >
            <Grid
                templateAreas={`"aside main"`}
                templateColumns={isSidebarCollapsed ? "60px 1fr" : "280px 1fr"}
                h="100vh"
                w="100vw"
                bg={colors.background.body}
                transition="all 0.3s ease-in-out"
                overflow="hidden"
            >
                {/* Sidebar */}
                <GridItem
                    area="aside"
                    overflow="hidden"
                    zIndex={10}
                >
                    <Sidebar onCollapse={setIsSidebarCollapsed} />
                </GridItem>

                {/* Main Chat Area */}
                <GridItem
                    area="main"
                    overflow="hidden"
                    bg={colors.background.body}
                    position="relative"
                >
                    <ChatArea />
                </GridItem>

            </Grid>
        </Box>
    );
};

export default ChatPage;