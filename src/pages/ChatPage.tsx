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
            overflow="auto"
            padding={"0px"}
            transition="all 0.3s ease-in-out"
               css={{
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#404040',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#505050',
                },
            }}
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
                overflow="auto"
                bg="app.bg"
                transition="all 0.3s ease-in-out"

            >
                <ChatArea />
            </GridItem>
        </Grid>
    );
};

export default ChatPage;