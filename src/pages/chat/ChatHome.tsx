import React from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";
import ChatSender from "@/components/chat/ChatSender.tsx";
import ChatMessage from "@/components/chat/ChatMessage.tsx";

const ChatHome = () => {



    return (
        <div >
            <div className='fixed z-10 h-12 w-12 mt-2 ml-2'>
                <SidebarTrigger/>
            </div>
            <div  className='h-lvh w-full flex flex-col justify-center items-center p-4'>
                <ChatMessage/>
                {/* 发送框 */}
                <ChatSender/>
            </div>
        </div>
    );
};

export default ChatHome;