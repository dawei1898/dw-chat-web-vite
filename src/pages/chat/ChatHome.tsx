import React from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";

const ChatHome = () => {



    return (
        <div>
            <div className='fixed z-10 h-12 w-12'>
                <SidebarTrigger/>
            </div>

            <h3>对话首页</h3>
        </div>
    );
};

export default ChatHome;