import React, { useState } from 'react';
import {
    Avatar, type GetRef, message, Skeleton, theme
} from "antd";
import {
    Actions, Bubble,
    type BubbleItemType,
    type BubbleListProps,
    Think
} from '@ant-design/x';
import {
    AudioOutlined,
    DislikeOutlined,
    EditOutlined,
    LikeOutlined,
    RedoOutlined,
} from "@ant-design/icons";
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import '@ant-design/x-markdown/themes/dark.css';
import '@ant-design/x-markdown/themes/light.css';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import {useTheme} from "@/provider/ThemeProvider.tsx";
import {DeepSeekIcon} from "@/components/icon/Icons.tsx";
import type {VoteType} from "@/types/chat.type.ts";

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
        content: `# Ant Design X
Ant Design X 是一款AI应用复合工具集，融合了 UI 组件库、流式 Markdown 渲染引擎和 AI SDK，为开发者提供构建下一代 AI 驱动应用的完整工具链。
![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)
基于 Ant Design 设计体系的 React UI 库、专为 AI 驱动界面设计，开箱即用的智能对话组件、无缝集成 API 服务，快速搭建智能应用界面，查看详情请点击 [Ant Design X](https://github.com/ant-design/x)。
`,
    },
    {
        key: '6',
        role: 'ai',
        content: `<think>啊，用户问我是谁，这是个很基础的自我介绍问题。需要简洁清晰地说明身份和核心功能，避免过度展开。
            可以用公司背景和基础定位开场，再补充关键特性：文本处理能力、文件支持、上下文长度和免费性质。
            提到知识截止日期和联网功能能管理预期，最后用开放性问题收尾保持对话延续性。
            注意语气要友好但保持信息密度，不需要用复杂句式，分点说明特性会更清晰。</think>
        \n 你好！我是DeepSeek，由深度求索公司创造的AI助手！😊 
        我是一个纯文本模型，虽然不支持多模态识别功能，但我可以帮你处理上传的各种文件，
        比如图像、txt、pdf、ppt、word、excel等文件，并从中读取文字信息进行分析处理。
        我拥有128K的上下文长度，可以处理比较长的对话和文档。 
        我最大的特点就是完全免费！没有任何收费计划，你可以放心地向我提问任何问题。
        如果需要最新信息，你也可以在Web/App上手动点开联网搜索功能。 
        无论是学习、工作、生活方面的疑问，还是需要文档分析、写作帮助、知识解答等，
        我都很乐意为你提供帮助！有什么想了解或需要协助的吗？
        `,
    },
    {
      key: '7',
      role: 'ai',
      content:  `
<think>Deep thinking is a systematic and structured cognitive approach that requires individuals to move beyond intuition and superficial information, delving into the essence of a problem and its underlying principles through logical analysis, multi-perspective examination, and persistent inquiry. Unlike quick reactions or heuristic judgments, deep thinking emphasizes ​slow thinking, actively engaging knowledge reserves, critical thinking, and creativity to uncover deeper connections and meanings.
Key characteristics of deep thinking include:
​Probing the Essence: Not settling for "what it is," but continuously asking "why" and "how it works" until reaching the fundamental logic.
​Multidimensional Connections: Placing the issue in a broader context and analyzing it through interdisciplinary knowledge or diverse perspectives.
​Skepticism & Reflection: Challenging existing conclusions, authoritative opinions, and even personal biases, validating them through logic or evidence.
​Long-term Value Focus: Prioritizing systemic consequences and sustainable impact over short-term or localized benefits.
This mode of thinking helps individuals avoid cognitive biases in complex scenarios, improve decision-making, and generate groundbreaking insights in fields such as academic research, business innovation, and social problem-solving.</think>
# Hello Deep Thinking\n Deep thinking is over.\n\n You can use the think tag to package your thoughts.
`
    },
    {
        key: '8',
        role: 'ai',
        loading: true,
        content: "加载中。。。。",
    },

]





/**
 * 思考组件
 */
const ThinkComponent = React.memo((props: ComponentProps) => {
    const [title, setTitle] = React.useState('深度思考中...');
    const [loading, setLoading] = React.useState(true);
    const [expand, setExpand] = React.useState(true);

    React.useEffect(() => {
        console.log('streamStatus:', props.streamStatus)

        if (props.streamStatus === 'done') {
            setTitle('已思考完成');
            setLoading(false);
            setExpand(true);
        }
    }, [props.streamStatus]);

    return (
        <Think
            title={title}
            loading={loading}
            expanded={expand}
            onClick={() => setExpand(!expand)}
        >
            {props.children}
        </Think>
    );
});


interface ChatMessagesProps {
    messages: BubbleItemType[];
    onLike?: (msgId: string, voteType: VoteType) => void;
    onDislike?: (msgId: string, voteType: VoteType) => void;
}


/**
 * 消息列表
 */
const ChatMessages =  (
    {
        messages = [],
        onLike,
        onDislike,
    }: ChatMessagesProps

) => {

    console.log('ChatMessages messages:', messages)

    const {token} = useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const {dark} = useTheme();

    const [edit, setEdit] = useState(false)
    const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);

    const roles: BubbleListProps['role'] = {
        user: (data: BubbleItemType) => {
            const isLastMessage = false;

            return {
                placement: 'end',
                typing: false,
                shape: 'round',
                /*footer: (content) => (
                    <Actions
                        items={userActionItems(content)}
                        onClick={handleActionClick}
                    />
                ),*/
                editable: edit,
                onEditCancel: () => {
                    setEdit(false)
                    message.success('取消编辑');
                },
                onEditConfirm: (value) => {
                    setEdit(false)
                    message.success('确认编辑：' + value);
                },
            }
        },
        ai: (data: BubbleItemType) => {
            const loading = data.status !== 'success';

            return {
                placement: 'start',
                shape: 'round',
                variant: 'borderless',
                avatar: () => (
                    <Avatar
                        icon={<DeepSeekIcon />}
                        style={{border: '1px solid #c5eaee', backgroundColor: token.colorBgBlur}}
                    />
                ),
                //header: (<h3>Markdown</h3>),
                typing: {effect: 'fade-in'},
                contentRender: (content) => (
                    <XMarkdown
                        className={dark ? "x-markdown-dark" : "x-markdown-light"}
                        content={content}
                        openLinksInNewTab
                        paragraphTag="div"
                        config={{extensions: Latex()}}
                        streaming={{
                            hasNextChunk: loading,
                            enableAnimation: true,
                            animationConfig: {
                                fadeDuration: 500,
                            },
                            incompleteMarkdownComponentMap: {
                                link: 'loading-link',
                                image: 'loading-image',
                                table: 'loading-table',
                                html: 'loading-html',
                            },
                        }}
                        components={LoadingComponents}
                    />
                ),

                footer: (content) => {
                    if (loading) return null;
                    return (
                        <Actions
                            items={aiActionItems(content)}
                            onClick={(menuInfo) => {
                                handleActionClick(menuInfo, data)
                            }}
                        />
                    )
                },
            }
        },
    }

    /**
     * 代码高亮/图表
     */
    const Code: React.FC<ComponentProps> = (props) => {
        const { className, children } = props;
        const lang = className?.match(/language-(\w+)/)?.[1] || '';

        if (typeof children !== 'string') return null;
        // 图表
        if (lang === 'mermaid') {
            return <Mermaid>{children}</Mermaid>;
        }
        // 代码高亮
        return <HighlightCode lang={lang}>{children}</HighlightCode>;
    };


    // 自定义加载组件
    const LoadingComponents = {
        think: ThinkComponent,
        code: Code,
        'loading-image': () =>
            <Skeleton.Image active style={{ width: 60, height: 60 }}/>,
        'loading-link': () =>
            <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }}/>,
        'incomplete-table': () =>
            <Skeleton.Node active style={{ width: 160 }} />,
        'incomplete-html': () =>
            <Skeleton.Node active style={{ width: 383, height: 120 }} />,
    };


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
            label: '复制',
            actionRender: () => {
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

    const handleActionClick = (menuInfo: any, data: BubbleItemType) => {
        console.log('menuInfo:', menuInfo)
        if (menuInfo.key === 'like') {
            if (onLike) {
                onLike(data.key as string, data.extraInfo?.voteType)
            }
        }
        if (menuInfo.key === 'dislike') {
            if (onDislike) {
                onDislike(data.key as string, data.extraInfo?.voteType)
            }
        }
        if (menuInfo.key === 'retry') {
            message.success('重新生成');
        }
        if (menuInfo.key === 'edit') {
            setEdit(!edit)
        }
    }


    // 滑动到顶部
    const scrollToTop = () => {
        listRef.current?.scrollTo({ top: 'top' })
    }

    // 滑动到底部
    const scrollToBottom = () => {
        listRef.current?.scrollTo({behavior: 'smooth' })
    }

    // 滑动到最后一条顶部
    const scrollToLastTop = () => {
        listRef.current?.scrollTo({ key: messages[messages.length - 1].key, block: 'start' })
    }



    return (
        <>
            {/*<div className='flex gap-4 max-w-2xl mx-auto px-4'>
                <Button onClick={scrollToTop}>
                    Scroll To Top
                </Button>
                <Button onClick={scrollToBottom}>
                    Scroll To Bottom
                </Button>
                <Button onClick={scrollToLastTop}>
                    Scroll To lastTop
                </Button>
            </div>*/}
            <Bubble.List
                className='max-w-2xl mx-auto px-4'
                //ref={listRef}
                items={messages}
                role={roles}
                /*onScroll={(e) => {
                    console.log('scroll:', (e.target as HTMLDivElement).scrollTop);
                }}*/
            />
        </>
    );
};

export default ChatMessages;