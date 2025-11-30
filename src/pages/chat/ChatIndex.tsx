import React from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";
import ChatSender from "@/components/chat/ChatSender.tsx";
import ChatMessages from "@/components/chat/ChatMessages.tsx";


const ChatIndex = () => {

    return (
        <div>
            <div className='fixed z-10 h-12 w-12 mt-2 ml-2'>
                <SidebarTrigger/>
            </div>
            <div className='h-[97vh]  flex flex-col justify-center items-center'>
                {/* 消息列表 */}
                <div className='h-full w-full px-1 overflow-y-auto scrollbar-container'>
                    <ChatMessages/>
                </div>

                {/* 发送框 */}
                <div className='w-full mt-auto'>
                    <ChatSender/>
                </div>
            </div>
        </div>
    );
};

export default ChatIndex;