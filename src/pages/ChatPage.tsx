import { Grid, GridItem } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import { useState } from "react";

const ChatPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <Grid
            templateAreas={`"aside main"`}
            templateColumns={isSidebarCollapsed ? "60px 1fr" : "350px 1fr"}
            h="100vh"
            bg="app.bg"
            color="app.text.primary"
            overflow="hidden"
            transition="all 0.3s ease-in-out"
        >
            <GridItem
                area="aside"
                overflow="hidden"
                zIndex={10}
            >
                <Sidebar onCollapse={setIsSidebarCollapsed} />
            </GridItem>
            <GridItem
                area="main"
                overflow="hidden"
                bg="app.bg"
                transition="all 0.3s ease-in-out"
            >
                <ChatArea />
            </GridItem>
        </Grid>
    );
};

export default ChatPage;