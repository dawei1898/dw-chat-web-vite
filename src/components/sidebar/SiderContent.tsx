import React, {useState} from 'react';
import {type GetProp, message} from "antd";
import {
    CodeOutlined, DeleteOutlined, EditOutlined,
    FileImageOutlined,
    FileSearchOutlined
} from "@ant-design/icons";
import {
    type ConversationItemType,
    Conversations,
    type ConversationsProps
} from "@ant-design/x";
import KeyCode from 'rc-util/lib/KeyCode';
import {useAppChat} from "@/provider/AppChatProvider.tsx";
import {useXConversations} from "@ant-design/x-sdk";



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


const items: ConversationItemType[] = Array.from({ length: 5 }).map((_, index) => ({
    key: `item${index + 1}`,
    label:
        index + 1 === 3
            ? "This's Conversation Item 3, you can click me!"
            : `Conversation Item ${index + 1}`,
    group: index < 3 ? 'Today' : 'Yesterday',
    disabled: index === 3,
}));

let idx = 16;

const SiderContent = () => {

    const { collapsed } = useAppChat();
    const {
        conversations,
        setConversations,
        setConversation,
        getConversation,
        addConversation,
        removeConversation,
        activeConversationKey,
        setActiveConversationKey,
    } = useXConversations({
        defaultConversations: items,
        defaultActiveConversationKey: items[0]?.key,
    });


    const onAdd = () => {
        addConversation({ key: `item${idx}`, label: `Conversation Item ${idx}` });
        idx = idx + 1;
    };

    const onUpdate = () => {
        setConversation(activeConversationKey, {
            key: activeConversationKey,
            label: 'Updated Conversation Item',
        });
    };

    const onReset = () => {
        setConversations(items);
        setActiveConversationKey('item1');
    };

    const menuConfig: ConversationsProps['menu'] = (conversation) => ({
        items: [
            {
                key: 'edit',
                label: '编辑',
                icon: <EditOutlined />,
            },
            {
                key: 'delete',
                label: '删除',
                icon: <DeleteOutlined />,
                danger: true,
            },
        ],
        onClick: () => {
            console.log('conversation:', conversation)
            removeConversation(conversation.key);
        },
    });

    return (
        <>
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
                    onClick: onAdd,
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