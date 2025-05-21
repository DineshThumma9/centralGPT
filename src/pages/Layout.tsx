import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <Box width="100vw" height="100vh" overflow="hidden">
            <Outlet />
        </Box>
    );
};

export default Layout;