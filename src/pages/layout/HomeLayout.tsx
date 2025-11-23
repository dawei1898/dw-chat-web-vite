import React from 'react';
import {Outlet} from "react-router";
import {XProvider} from "@ant-design/x";
import zhCN from 'antd/locale/zh_CN';
import {Flex, Layout, theme, type ThemeConfig} from "antd";
import AppSider from "@/pages/layout/AppSider.tsx";
import {useTheme} from "@/provider/ThemeProvider.tsx";


const {useToken} = theme;

/**
 * 页面布局
 */
const HomeLayout = () => {

    const {token} = useToken();
    const {dark} = useTheme();

    // 主题配置
    const customTheme: ThemeConfig = {
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: token.colorPrimary,
        },
        components: {
            Layout: {
                siderBg: token.colorBgBlur,
                lightSiderBg: token.colorBgBlur,
            }
        }
    }

    return (
        <XProvider
            locale={zhCN}
            theme={customTheme}
        >
            {/*<div>
                <h3>首页布局</h3>
                <p>侧边栏</p>
                <Outlet/>
            </div>*/}

            <Layout className='h-lvh'>
                <Layout>
                    {/* 侧边栏 */}
                    <AppSider/>

                    {/* 右侧页面 */}
                    <Layout>
                        <Layout.Content className='h-full p-4 overflow-scroll'>
                            {/* 路由切入点 */}
                            <Outlet/>
                        </Layout.Content>

                        <Layout.Footer style={{padding: '10px'}}>
                            <Flex justify='center' align='start'>
                                <p> Powered by Ant Desgin </p>
                            </Flex>
                        </Layout.Footer>
                    </Layout>
                </Layout>
            </Layout>
        </XProvider>
    );
};

export default HomeLayout;