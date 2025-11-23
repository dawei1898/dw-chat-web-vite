import React from 'react';
import Logo from "@/components/Logo.tsx";
import Title from "@/components/Title.tsx";
import {useAppChat} from "@/provider/AppChatProvider.tsx";

const SiderHeader = () => {
    const { collapsed } = useAppChat();

    return (
        <div className='flex justify-center items-center gap-2 py-2'>
            <Logo/>
            {!collapsed && <Title/>}
        </div>
    );
};

export default SiderHeader;