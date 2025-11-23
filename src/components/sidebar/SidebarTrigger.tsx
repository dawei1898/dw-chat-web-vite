import React from 'react';
import {Button, Tooltip} from "antd";
import {useAppChat} from "@/provider/AppChatProvider.tsx";
import {PanelLeftClose, PanelLeftOpen} from "@/components/icon/Icons.tsx";

/**
 * 侧边栏打开、收起的触发按钮
 */
const SidebarTrigger = () => {
    const {collapsed, setCollapsed} = useAppChat();

    return (
        <Tooltip title={collapsed ? '打开边栏' : '收起边栏'} placement='right'>
            <Button
                styles={{icon: {color: '#676767'}}}
                type='text'
                icon={collapsed ? <PanelLeftOpen/> : <PanelLeftClose/>}
                onClick={() => setCollapsed(!collapsed)}
            />
        </Tooltip>
    );
};

export default SidebarTrigger;