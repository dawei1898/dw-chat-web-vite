import React from 'react';
import {Layout} from "antd";
import {useTheme} from "@/provider/ThemeProvider.tsx";
import {useAppChat} from "@/provider/AppChatProvider.tsx";
import SiderFooter from "@/components/sidebar/SiderFooter.tsx";
import SiderHeader from "@/components/sidebar/SiderHeader.tsx";
import SiderContent from "@/components/sidebar/SiderContent.tsx";



interface AppSiderType {
    light: boolean
}

/**
 * 侧边栏
 */
const AppSider = () => {
    const { dark, theme } = useTheme();
    const { collapsed, setCollapsed } = useAppChat();

    return (
        <Layout.Sider
            theme={theme}
            width='240' // 侧边栏宽度
            breakpoint='md' // 收起边栏的页面宽度触发点
            collapsedWidth={60} // 边栏收起后的宽度
            collapsed={collapsed}
            onCollapse={setCollapsed}
        >
             <div className={'h-lvh flex flex-col border-r-1 border-gray-200 dark:border-neutral-600'}>
                 {/* Header 区域 */}
                 <SiderHeader/>

                 {/* 可滚动内容区域 */}
                 <SiderContent/>

                 {/* 固定底部区域 */}
                 <SiderFooter />
            </div>

        </Layout.Sider>
    );
};

export default AppSider;