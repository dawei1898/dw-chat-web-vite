import React from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";
import ChatPage from "@/components/chat/ChatPage.tsx";
import {useAuth} from "@/provider/AuthProvider.tsx";

const ChatHome = () => {

    const {user} = useAuth();

    return (
        <div >
            <div className='fixed z-10 h-12 w-12 mt-2 ml-2'>
                <SidebarTrigger/>
            </div>
            <ChatPage user={user}/>
        </div>
    );
};

export default ChatHome;