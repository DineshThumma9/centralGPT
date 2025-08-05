import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme";
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import {Toaster} from "./components/ui/toaster.tsx";



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider value={theme}>
                <RouterProvider router={router}/>
            <Toaster/>
        </ChakraProvider>
    </React.StrictMode>,
)