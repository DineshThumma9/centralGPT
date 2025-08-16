import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme";
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import {Toaster} from "./components/ui/toaster.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";




const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
            <QueryClientProvider client={queryClient}>
        <ChakraProvider value={theme}>
                <RouterProvider router={router}/>
            <Toaster/>
        </ChakraProvider>
                </QueryClientProvider>
    </React.StrictMode>,
)