import React, {useState} from 'react';
import {Conversations, type ConversationsProps} from "@ant-design/x";
import type {GetProp} from "antd";
import {CodeOutlined, FileImageOutlined, FileSearchOutlined, SignatureOutlined} from "@ant-design/icons";



const agentItems: GetProp<ConversationsProps, 'items'> = [
    {
        key: 'write',
        label: 'Help Me Write',
        icon: <SignatureOutlined />,
    },
    {
        key: 'coding',
        label: 'AI Coding',
        icon: <CodeOutlined />,
    },
    {
        key: 'createImage',
        label: 'Create Image',
        icon: <FileImageOutlined />,
    },
    {
        key: 'deepSearch',
        label: 'Deep Search',
        icon: <FileSearchOutlined />,
    },
    {
        type: 'divider',
    },
];


const defaultItems: GetProp<ConversationsProps, 'items'> = Array.from({ length: 15 }).map((_, index) => ({
    key: `item${index + 1}`,
    label:
        index === 0
            ? "This's Conversation Item 1, you can click me!"
            : `Conversation Item ${index + 1}`,
    group: index < 3 ? 'Today' : 'Yesterday',
}));

const SiderContent = () => {

    const [historicalItems, setHistoricalItems] = useState<GetProp<ConversationsProps, 'items'>>(defaultItems);

    const items = [...agentItems, ...historicalItems]

    return (
        <div className=' px-1 overflow-y-auto scrollbar-container'>
            <Conversations
                creation={{
                    label: '新会话'
                }}
                items={items}
                defaultActiveKey="item1"
                groupable
                styles={{
                    creation: {
                        color: 'yellow'
                    },
                    item: {
                        color: 'red',

                    },
                    group: {
                        color: 'green',
                        backgroundColor: 'blue',
                        overflowY: 'hidden',
                    }
                }}
            />
        </div>
    );
};

export default SiderContent;