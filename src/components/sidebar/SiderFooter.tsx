import React from 'react';

import {
    Button, Dropdown,
    type MenuProps, Space, Typography
} from "antd";
import {
    GithubFilled, LogoutOutlined, MoonFilled,
    SettingOutlined, SunOutlined, UserOutlined
} from "@ant-design/icons";
import {useAppChat} from "@/provider/AppChatProvider.tsx";
import {useTheme} from "@/provider/ThemeProvider.tsx";
import {useAuth} from "@/provider/AuthProvider.tsx";
import {NavLink} from "react-router";


const SiderFooter = () => {
    const {collapsed, setCollapsed} = useAppChat();
    const {dark, toggleTheme} = useTheme();
    const {user, logout} = useAuth();

    // 用户头像下拉菜单项
    const items: MenuProps['items'] = [
        {
            key: 'setting',
            label: '个人设置',
            icon: (<SettingOutlined/>),
        },
        {
            key: 'logout',
            label: (
                <div onClick={logout}>
                    {'退出登录'}
                </div>
            ),
            icon: (<LogoutOutlined/>),
        },

    ]

    return (
        <div className={'flex justify-center items-center p-2 mt-auto'}>
            {/* 用户信息 */}
            <div>
                <Dropdown
                    menu={{items}}
                    placement='top'
                >
                    <Space className='cursor-pointer'>
                        <Button size='small' shape='circle'>
                            <UserOutlined/>
                        </Button>
                        {!collapsed &&
                            <Typography.Text>
                                {user?.username}
                            </Typography.Text>
                        }
                    </Space>
                </Dropdown>
            </div>

            {!collapsed &&
                <div className='flex gap-1 ml-auto'>
                    {/* 亮暗模式切换 */}
                    <Button
                        key='dark'
                        type='text'
                        shape='circle'
                        onClick={toggleTheme}
                    >
                        {dark ?
                            <MoonFilled style={{fontSize: '18px'}}/>
                            : <SunOutlined style={{fontSize: '18px'}}/>
                        }
                    </Button>

                    {/* Github */}
                    <NavLink
                        key='github_link'
                        to='https://github.com/dawei1898/dw-chat-web-vite'
                        target="_blank"
                    >
                        <Button key='github' type='text' shape='circle'>
                            <GithubFilled style={{fontSize: '18px'}}/>
                        </Button>
                    </NavLink>
                </div>
            }
        </div>
    );
};

export default SiderFooter;