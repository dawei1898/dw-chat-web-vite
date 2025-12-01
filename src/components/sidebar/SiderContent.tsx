import React, {useEffect, useState} from 'react';
import {type GetProp, Input, message, Modal} from "antd";
import {
    CodeOutlined, DeleteOutlined, EditOutlined,
    FileImageOutlined,
    FileSearchOutlined
} from "@ant-design/icons";
import {
    Conversations,
    type ConversationsProps
} from "@ant-design/x";
import KeyCode from 'rc-util/lib/KeyCode';
import {useAppChat} from "@/provider/AppChatProvider.tsx";
import {
    type ConversationData, useXConversations
} from "@ant-design/x-sdk";
import {
    deleteChatAPI, queryChatPageAPI, saveChatAPI
} from "@/apis/chat/chatApi.ts";
import {useNavigate} from "react-router";
import type {ChatRecordVO} from "@/types/chat.type.ts";


const agentItems: GetProp<ConversationsProps, 'items'> = [
    {
        key: 'coding',
        label: 'AI Coding',
        icon: <CodeOutlined/>,
    },
    {
        key: 'createImage',
        label: 'Create Image',
        icon: <FileImageOutlined/>,
    },
    {
        key: 'deepSearch',
        label: 'Deep Search',
        icon: <FileSearchOutlined/>,
    },

];


/**
 * 会话管理列表
 */
const SiderContent = () => {

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const {collapsed} = useAppChat();

    const {
        conversations,
        setConversations,
        activeConversationKey,
        setActiveConversationKey,
    } = useXConversations({});

    useEffect(() => {
        initConversations();
    }, []);

    useEffect(() => {
        //console.log('activeConversationKey:', activeConversationKey)
        if (activeConversationKey) {
            navigate(`/chat/${activeConversationKey}`)
        }
    }, [activeConversationKey]);


    /**
     * 初始化会话记录
     */
    const initConversations = async () => {
        try {
            const resp = await queryChatPageAPI({
                pageNum: 1, pageSize: 100, chatName: ''
            })
            if (resp.code == 200) {
                if (resp.data) {
                    const initConversationItems: ConversationData[] =
                        resp.data.list.map((item) => {
                            return convertConversation(item);
                        });
                    setConversations(initConversationItems);
                }
            } else {
                messageApi.error(resp.message)
            }
        } catch (e: any) {
            messageApi.error(e.message)
        }
    }

    /**
     * 转换对话，根据更新时间分组
     */
    const convertConversation = (item: ChatRecordVO) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const lastUseTime = new Date(item.updateTime);

        let group = ''
        if (lastUseTime >= today) {
            group = '今天'
        } else if (lastUseTime >= yesterday) {
            group = '昨天'
        } else if (lastUseTime >= sevenDaysAgo) {
            group = '过去 7 天'
        } else if (lastUseTime >= thirtyDaysAgo) {
            group = '过去 30 天'
        } else {
            group = '30 天以前'
        }
        return {
            key: item.chatId,
            label: item.chatName,
            updateTime: item.updateTime,
            group: group,
        }
    }

    // 点击添加会话
    const clickAddConversation = () => {
        setActiveConversationKey('')
        navigate('/')
    }

    /**
     * 保存会话名称
     */
    const saveConversation = async (key: string, label: string) => {
        const resp = await saveChatAPI({
            chatId: key,
            chatName: label,
        })
        if (resp.code == 200) {
            await initConversations()
        } else {
            messageApi.error(resp.message)
        }
    }

    /**
     * 删除会话记录
     */
    const deleteConversation = async (conversationKey: string) => {
        if (conversationKey) {
            const resp = await deleteChatAPI(conversationKey)
            if (resp.code == 200) {
                await initConversations()
            } else {
                messageApi.error(resp.message)
            }
        }
    }

    const menuConfig: ConversationsProps['menu'] = (conversation) => ({
        items: [
            {
                label: '重命名',
                key: 'rename',
                icon: <EditOutlined/>,
            },
            {
                key: 'delete',
                label: '删除',
                icon: <DeleteOutlined/>,
                danger: true,
            },
        ],
        onClick: (menuInfo) => {
            menuInfo.domEvent.stopPropagation();
            let newLabel = '';
            // 重命名会话
            if (menuInfo.key === 'rename') {
                Modal.confirm({
                    title: '重命名会话',
                    content: (
                        <Input
                            placeholder="请输入新的会话名称"
                            defaultValue={conversation.label?.toString()}
                            onChange={(e) => {
                                newLabel = e.target.value;
                            }}
                        />
                    ),
                    okText: '保存',
                    cancelText: '取消',
                    onOk: async () => {
                        if (newLabel) {
                            await saveConversation(conversation.key, newLabel)
                            messageApi.success('重命名成功');
                        }
                    },
                    onCancel: () => {
                        messageApi.info('取消重命名');
                    },
                });
            }
            // 删除会话
            if (menuInfo.key === 'delete') {
                Modal.confirm({
                    title: '永久删除对话',
                    content: '删除后，该对话不可恢复，确认删除吗？',
                    okType: 'danger',
                    okText: '删除',
                    cancelText: '取消',
                    onOk: async () => {
                        await deleteConversation(conversation.key)
                        messageApi.success('删除成功')
                    }
                });
            }
        },
    });

    return (
        <>
            {contextHolder}
            <Conversations
                styles={{
                    root: {
                        height: '350px',
                        marginBottom: '-40px',
                    },
                    creation: {
                        borderRadius: '10px',
                    }
                }}
                creation={{
                    align: 'center',
                    label: collapsed ? <></> : '新会话',
                    onClick: clickAddConversation,
                }}
                items={agentItems}
                shortcutKeys={{
                    creation: ['Meta', KeyCode.K],
                    items: ['Alt', 'number'],
                }}
            />
            {!collapsed && (
                <div id="scrollableDiv" className='h-full overflow-scroll scrollbar-container'>
                    <Conversations
                        style={{
                            marginBottom: '-10px',
                        }}
                        items={conversations}
                        groupable
                        menu={menuConfig}
                        activeKey={activeConversationKey}

                        onActiveChange={(value) => {
                            console.log("active:", value)
                            setActiveConversationKey(value)
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default SiderContent;