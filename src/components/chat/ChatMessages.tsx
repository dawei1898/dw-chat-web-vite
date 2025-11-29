import React from 'react';
import {Avatar, message, theme} from "antd";
import {Actions, Bubble} from '@ant-design/x';
import {AntDesignOutlined, RedoOutlined} from "@ant-design/icons";


const {useToken} = theme;



const actionItems = (content: string) => [
    {
        key: 'copy',
        label: 'copy',
        actionRender: () => {
            return <Actions.Copy text={content} />;
        },
    },
    {
        key: 'retry',
        icon: <RedoOutlined />,
        label: 'Retry',
    },
];

const text = `Hello World\nNext line\nTab\tindent`;


/**
 * 消息列表
 */
const ChatMessages = () => {
    const {token} = useToken();
    const [messageApi, contextHolder] = message.useMessage();


    return (
        <div className='w-full '>
            <div   className='max-w-xl mx-auto '>
                <Bubble
                    content={text}
                    typing={{ effect: 'fade-in' }}
                    header={<h5>Ant Design X</h5>}
                    footer={(content) => (
                        <Actions items={actionItems(content)} onClick={() => console.log(content)} />
                    )}
                    avatar={<Avatar icon={<AntDesignOutlined />} />}
                />
            </div>
        </div>
    );
};

export default ChatMessages;