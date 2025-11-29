import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import router from "@/routers/Router.tsx";
import {RouterProvider} from "react-router";
import {AuthProvider} from "@/provider/AuthProvider.tsx";
import ThemeProvider from "@/provider/ThemeProvider.tsx";
import AppChatProvider from "@/provider/AppChatProvider.tsx";
import {App} from "antd";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme='light' storageKey='theme'>
            <AuthProvider>
                <AppChatProvider>
                    <App>
                        <RouterProvider router={router}/>
                    </App>
                </AppChatProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
