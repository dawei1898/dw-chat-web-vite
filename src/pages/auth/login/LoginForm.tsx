import React, {useState} from 'react';
import {
    Button, Card, Checkbox, ConfigProvider,
    Flex, Form, Input, message,
    Space, theme, Typography
} from "antd";
import {useNavigate} from "react-router";
import Logo from "@/components/Logo.tsx";
import Title from "@/components/Title.tsx";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import type {LoginParam} from "@/types/user.type.ts";
import {useAuth} from "@/provider/AuthProvider.tsx";

const {useToken} = theme

/**
 * 登录表单
 */
const LoginForm = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const {token} = useToken();
    const [form] = Form.useForm<LoginParam>();
    const navigate = useNavigate();
    const {login} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);


    /**
     * 处理登录操作
     */
    const handleLogin = async (param: LoginParam) => {
        try {
            setLoading(true)

            await login(param)

            // 跳到首页
            console.log('跳到首页')
            navigate('/')
        } catch (e) {
            console.log('登录失败：', e)
            if (e instanceof Error) {
                messageApi.error(e.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <ConfigProvider>
            {contextHolder}
            <Card
                variant='borderless'
                styles={{
                    root: {
                        backgroundColor: token.colorBgContainer,
                        width: '400px',
                        padding: '10px 20px',
                        borderRadius: '15px'
                    }
                }}
            >
                <Flex vertical gap={30}>
                    <Flex vertical justify='center' align='center' gap='middle'>
                        <Flex gap='small'>
                            <Logo/>
                            <Title/>
                        </Flex>
                        <Typography.Title level={5} type='secondary'>
                            AI 对话页面
                        </Typography.Title>
                    </Flex>

                    <div>
                        <Form
                            name='login-form'
                            form={form}
                            onFinish={handleLogin}
                        >
                            <Form.Item
                                name='username'
                                rules={[{
                                    required: true,
                                    message: '用户名不能为空！'
                                }]}
                            >
                                <Input
                                    prefix={<UserOutlined/>}
                                    size='large'
                                    allowClear
                                    placeholder='用户名：dawei'
                                />
                            </Form.Item>

                            <Form.Item
                                name='password'
                                rules={[{
                                    required: true,
                                    min: 6,
                                    max: 15,
                                    message: '密码长度在 6-15 之间'
                                }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined/>}
                                    size='large'
                                    placeholder='密码：123456'
                                />
                            </Form.Item>

                            <Form.Item>
                                <Flex justify='space-between'>
                                    <Form.Item name='remember' valuePropName='checked' noStyle>
                                        <Space size='small'>
                                            <Checkbox/>
                                            <span>记住我</span>
                                        </Space>
                                    </Form.Item>
                                    <a href="#">忘记密码？</a>
                                </Flex>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type='primary'
                                    size='large'
                                    block
                                    onClick={form.submit}
                                    disabled={loading}
                                >
                                    登录
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                <Flex justify='center'>
                                    <span>还没有账号？</span> <a href='#'>去注册</a>
                                </Flex>
                            </Form.Item>
                        </Form>
                    </div>
                </Flex>
            </Card>
        </ConfigProvider>
    );
};

export default LoginForm;