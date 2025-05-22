import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <Box color = "grey">
            <Outlet />
        </Box>
    );
};

export default Layout;