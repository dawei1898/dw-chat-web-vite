import React, {useState} from 'react';
import {Conversations, type ConversationsProps} from "@ant-design/x";
import type {GetProp} from "antd";
import {CodeOutlined, FileImageOutlined, FileSearchOutlined} from "@ant-design/icons";
import KeyCode from 'rc-util/lib/KeyCode';
import {useAppChat} from "@/provider/AppChatProvider.tsx";



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


const defaultItems: GetProp<ConversationsProps, 'items'> = Array.from({length: 15}).map((_, index) => ({
    key: `item${index + 1}`,
    label:
        index === 0
            ? "This's Conversation Item 1, you can click me!"
            : `Conversation Item ${index + 1}`,
    group: index < 3 ? 'Today' : 'Yesterday',
}));

const SiderContent = () => {

    const { collapsed } = useAppChat();
    const [historicalItems, setHistoricalItems] = useState<GetProp<ConversationsProps, 'items'>>(defaultItems);

    const newChatClick = () => {
        setHistoricalItems((ori) => {
            return [
                ...ori,
                {
                    key: `item${ori.length + 1}`,
                    label: `Conversation Item ${ori.length + 1}`,
                    group: 'Today',
                },
            ];
        });
    };

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
                    onClick: newChatClick,
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
                        items={historicalItems}
                        defaultActiveKey="item1"
                        groupable
                        onActiveChange={(value) => {
                            console.log("active:", value)
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default SiderContent;