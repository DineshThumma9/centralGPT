import { Grid, GridItem, Box } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import { useState } from "react";

const ChatPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <Box
            h="100vh"
            w="100vw"
            color="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"
            overflow="hidden"
            position="relative"
        >
            <Grid
                templateAreas={`"aside main"`}
                templateColumns={isSidebarCollapsed ? "60px 1fr" : "280px 1fr"}
                h="100vh"
                w="100vw"
                color="linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)"
                transition="all 0.3s ease-in-out"
                overflow="hidden"
            >
                {/* Sidebar */}
                <GridItem
                    area="aside"
                    overflow="hidden"
                    zIndex={10}
                    // borderRight="1px solid"
                    // borderColor="gray.200"
                >
                    <Sidebar onCollapse={setIsSidebarCollapsed} />
                </GridItem>

                {/* Main Chat Area */}
                <GridItem
                    area="main"
                    overflow="hidden"
                    bg="#fafafa"
                    position="relative"
                >
                    <ChatArea />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default ChatPage;