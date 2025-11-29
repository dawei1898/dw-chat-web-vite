import React, {useCallback, useEffect} from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";
import ChatSender from "@/components/chat/ChatSender.tsx";
import ChatMessages from "@/components/chat/ChatMessages.tsx";
import {Actions, Bubble, type BubbleItemType, type BubbleListProps} from '@ant-design/x';
import {AntDesignOutlined, CopyOutlined, RedoOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar, type GetRef} from "antd";



const actionItems = [
    {
        key: 'retry',
        icon: <RedoOutlined />,
        label: 'Retry',
    },
    {
        key: 'copy',
        icon: <CopyOutlined />,
        label: 'Copy',
    },
];

let id = 0;

const getKey = () => `bubble_${id++}`;

const genItem = (isAI: boolean, config?: Partial<BubbleItemType>) => {
    return {
        key: getKey(),
        role: isAI ? 'ai' : 'user',
        content: `${id} : ${isAI ? 'Mock AI content'.repeat(50) : 'Mock user content.'}`,
        ...config,
        // cache: true,
    };
};

function useBubbleList(initialItems: BubbleItemType[] = []) {
    const [items, setItems] = React.useState<BubbleItemType[]>(initialItems);

    const appendItem = useCallback((item: BubbleItemType) => {
        setItems((prev) => [...prev, item]);
    }, []);

    return [items, setItems, appendItem] as const;
}

const ChatIndex = () => {

    const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
    const [items, setItems] = useBubbleList();

    useEffect(() => {
        setItems([
            genItem(false, { typing: false }),
            genItem(true, { typing: false }),
            /*genItem(false, { typing: false }),
            genItem(true, { typing: false }),
            genItem(false, { typing: false }),
            genItem(true, { typing: false }),
            genItem(false, { typing: false }),
            genItem(true, { typing: false }),
            genItem(false, { typing: false }),
            genItem(true, { typing: false }),
            genItem(false, { typing: false }),*/
        ]);
    }, []);

    const memoRole: BubbleListProps['role'] = React.useMemo(
        () => ({
            ai: {
                typing: true,
                header: 'AI',
                avatar: () => <Avatar icon={<AntDesignOutlined />} />,
                footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />,
            },
            user: {
                placement: 'end',
                typing: false,
                header: 'User',
                avatar: () => <Avatar icon={<UserOutlined />} />,
            },
        }),
        [],
    );


    return (
        <div>
            <div className='fixed z-10 h-12 w-12'>
                <SidebarTrigger/>
            </div>
            <div className='h-lvh  flex flex-col justify-center items-center p-4'>
                {/* 消息列表 */}
                <div className='h-full w-full px-1 overflow-y-auto scrollbar-container'>
                    <Bubble.List
                        className='max-w-2xl mx-auto'
                        ref={listRef}
                        items={items}
                        role={memoRole}
                        onScroll={(e) => {
                            console.log('scroll', (e.target as HTMLDivElement).scrollTop);
                        }}
                    />
                </div>

                {/* 发送框 */}
                <div className='w-full mt-auto'>
                    <ChatSender/>
                </div>
            </div>
        </div>
    );
};

export default ChatIndex;