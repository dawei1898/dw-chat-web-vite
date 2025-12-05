import React from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";
import {useParams} from "react-router";
import {useAuth} from "@/provider/AuthProvider.tsx";
import ChatPage from "@/components/chat/ChatPage.tsx";



/**
 * 对话页面
 */
const ChatIndex = () => {
    const { chatId } = useParams<{ chatId: string }>();
    //console.log('ChatIndex chatId：', chatId)
    const {user} = useAuth();


    return (
        <div>
            <div className='fixed z-10 h-12 w-12 mt-2 ml-2'>
                <SidebarTrigger/>
            </div>
            <ChatPage user={user} chatId={chatId}/>
        </div>
    );
};

export default ChatIndex;