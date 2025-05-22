import { Grid, GridItem } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea";

const ChatPage = () => {
    return (
        <Grid
            templateAreas={{
                lg: `"aside main"`,
                base: `"aside main"`
            }}
            templateColumns={{lg: '250px 1fr', base: '80px 1fr'}}
            h="100vh"
            color = "grey"
        >
            <GridItem area="aside">
                <Sidebar/>
            </GridItem>
            <GridItem area="main">
                <ChatArea/>
            </GridItem>
        </Grid>
    );
};

export default ChatPage;