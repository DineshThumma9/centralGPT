import { Grid, GridItem } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import { useState } from "react";

const ChatPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <Grid
            templateAreas={{
                lg: `"aside main"`,
                base: `"aside main"`
            }}
            templateColumns={{
                lg: isSidebarCollapsed ? "60px 1fr" : "350px 1fr", // Adjust main area width dynamically
                base: "80px 1fr"
            }}
            h="100vh"
            color="gray.700"
            overflow="hidden"
        >
            <GridItem area="aside" overflow="hidden">
                <Sidebar onCollapse={setIsSidebarCollapsed} />
            </GridItem>
            <GridItem area="main" overflow="hidden">
                <ChatArea />
            </GridItem>
        </Grid>
    );
};

export default ChatPage;
