import {Grid, GridItem} from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import LLMModelChooser from "../components/LLMModelChooser";

const ChatPage = () => {
    return (
        <Grid
            templateAreas={{
                lg: `
      nav nav
      aside main
    `,
                base: `
      nav
      aside main
    `
            }}
            templateColumns={{lg: '250px 1fr', base: '80px 1fr'}} // Adjust widths as needed
            templateRows={{lg: '60px 1fr', base: '60px 1fr'}}    // Optional: adjust heights
        >
            <GridItem area="aside">
                <Sidebar/>
            </GridItem>
            <GridItem area="main">
                <ChatArea/>
            </GridItem>
            <GridItem area="nav">
                <LLMModelChooser/>
            </GridItem>
        </Grid>
    );
};

export default ChatPage;