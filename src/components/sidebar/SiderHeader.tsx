import React from 'react';
import Logo from "@/components/Logo.tsx";
import Title from "@/components/Title.tsx";
import {useAppChat} from "@/provider/AppChatProvider.tsx";
import {NavLink} from "react-router";

const SiderHeader = () => {
    const { collapsed } = useAppChat();

    return (
        <NavLink to={'/'}>
            <div className='flex justify-center items-center gap-2 py-2 cursor-pointer'>
                <Logo/>
                {!collapsed && <Title/>}
            </div>
        </NavLink>
    );
};

export default SiderHeader;