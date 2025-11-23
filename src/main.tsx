import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import router from "@/routers/Router.tsx";
import {RouterProvider} from "react-router";
import {AuthProvider} from "@/provider/AuthProvider.tsx";
import ThemeProvider from "@/provider/ThemeProvider.tsx";
import AppChatProvider from "@/provider/AppChatProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <AppChatProvider>
                    <RouterProvider router={router}/>
                </AppChatProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
