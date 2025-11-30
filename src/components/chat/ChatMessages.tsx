import React, {useEffect, useState} from 'react';
import {Avatar, type GetRef, message, theme, Typography} from "antd";
import {Actions, Bubble, type BubbleItemType, type BubbleListProps} from '@ant-design/x';
import {
    AntDesignOutlined,
    AudioOutlined,
    CopyOutlined,
    DislikeOutlined,
    EditOutlined,
    LikeOutlined,
    RedoOutlined,
} from "@ant-design/icons";
import XMarkdown from "@ant-design/x-markdown";


const {useToken} = theme;



const initMessages = [
    {
        key: '1',
        role: 'user',
        content: '你是谁？',
    },
    {
        key: '2',
        role: 'ai',
        reasoning_content: '啊，用户问我是谁，这是个很基础的自我介绍问题。需要简洁清晰地说明身份和核心功能，避免过度展开。\n' +
            '可以用公司背景和基础定位开场，再补充关键特性：文本处理能力、文件支持、上下文长度和免费性质。提到知识截止日期和联网功能能管理预期，最后用开放性问题收尾保持对话延续性。\n' +
            '注意语气要友好但保持信息密度，不需要用复杂句式，分点说明特性会更清晰。',
        content: "你好！我是DeepSeek，由深度求索公司创造的AI助手！😊\n" +
            "我是一个纯文本模型，虽然不支持多模态识别功能，但我可以帮你处理上传的各种文件，比如图像、txt、pdf、ppt、word、excel等文件，并从中读取文字信息进行分析处理。我拥有128K的上下文长度，可以处理比较长的对话和文档。\n" +
            "我最大的特点就是完全免费！没有任何收费计划，你可以放心地向我提问任何问题。如果需要最新信息，你也可以在Web/App上手动点开联网搜索功能。\n" +
            "无论是学习、工作、生活方面的疑问，还是需要文档分析、写作帮助、知识解答等，我都很乐意为你提供帮助！有什么想了解或需要协助的吗？",
    },
    {
        key: '3',
        role: 'user',
        content: '使用 java 输出 你好',
    },
    {
        key: '4',
        role: 'ai',
        content: "在 Java 中输出 \"你好\" 有多种方式，以下是几种常见的写法：\n" +
            "## 1. 基础写法（最常用）\n" +
            "```java\n" +
            "public class Main {\n" +
            "    public static void main(String[] args) {\n" +
            "        System.out.println(\"你好\");\n" +
            "    }\n" +
            "}\n" +
            "```\n" +
            "## 运行步骤：\n" +
            "1. 将代码保存为 `Main.java`\n" +
            "2. 编译：`javac Main.java`\n" +
            "3. 运行：`java Main`\n" +
            "最简单的就是第一种方法，直接使用 `System.out.println(\"你好\");` 即可在控制台输出中文\"你好\"！",
    },
    {
        key: '5',
        role: 'ai',
        loading: true,
        content: "加载中。。。。",
    },
]


/**
 * 消息列表
 */
const ChatMessages = () => {
    const {token} = useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [edit, setEdit] = useState(false)
    const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
    const [messages, setMessages] = useState<BubbleItemType[]>(initMessages)


    const roles: BubbleListProps['role'] = {
        user: {
            placement: 'end',
            typing: false,
            shape: 'round',
            footer: (content) => (
                <Actions
                    items={userActionItems(content)}
                    onClick={handleActionClick}
                />
            ),
            editable: edit,
            onEditCancel: () => {
                setEdit(false)
                message.success('取消编辑');
            },
            onEditConfirm: (value) => {
                setEdit(false)
                message.success('确认编辑：' + value);
            },
        },
        ai: {
            placement: 'start',
            shape: 'round',
            variant: 'outlined',
            avatar: () => <Avatar icon={<AntDesignOutlined/>}/>,
            header: (<h3>Markdown</h3>),
            typing: {effect: 'fade-in'},
            contentRender: (content) => (
                <XMarkdown
                    content={content}
                    streaming={{
                        enableAnimation: true,
                        animationConfig: {
                            fadeDuration: 500,
                        }
                    }}
                />
            ),
            footer: (content) => (
                <Actions
                    items={aiActionItems()}
                    onClick={handleActionClick}
                />
            ),
        },
    }


    const userActionItems = (content?: string) => [
        {
            key: 'copy',
            label: '复制',
            actionRender: () => {
                return <Actions.Copy text={content}/>;
            },
        },
        {
            key: 'edit',
            label: '编辑',
            icon: <EditOutlined/>,
        },
    ];


    const aiActionItems = (content?: string) => [
        {
            key: 'copy',
            icon: <CopyOutlined/>,
            label: '复制',
            actionRender: (e: any) => {
                return <Actions.Copy text={content}/>;
            },
        },
        {
            key: 'like',
            icon: <LikeOutlined/>,
            label: '喜欢',
        },
        {
            key: 'dislike',
            icon: <DislikeOutlined/>,
            label: '不喜欢',
        },
        {
            key: 'retry',
            icon: <RedoOutlined/>,
            label: '重新生成',
        },
        {
            key: 'audio',
            icon: <AudioOutlined/>,
            label: '语音',
            actionRender: () => {
                return <Actions.Audio/>;
            },
        },
    ];

    const handleActionClick = (menuInfo: any) => {
        console.log('menuInfo:', menuInfo)
        if (menuInfo.key === 'like') {
            message.success('喜欢');
        }
        if (menuInfo.key === 'dislike') {
            message.success('不喜欢');
        }
        if (menuInfo.key === 'retry') {
            message.success('重新生成');
        }
        if (menuInfo.key === 'edit') {
            setEdit(!edit)
        }
    }


    return (
        <>
            <Bubble.List
                className='max-w-2xl mx-auto px-4'
                ref={listRef}
                items={messages}
                role={roles}
                onScroll={(e) => {
                    console.log('scroll:', (e.target as HTMLDivElement).scrollTop);
                }}
            />
        </>
    );
};

export default ChatMessages;