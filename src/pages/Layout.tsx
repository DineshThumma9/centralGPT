import { Box } from "@chakra-ui/react";
import {Outlet} from "react-router-dom";


const Layout  = () => {
    return (
        <>
            <Box padding="2rem" maxWidth="100vw" margin="0" textAlign="center">
                <Outlet/>
            </Box>
        </>
    )
}


export default Layout;

