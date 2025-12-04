import {
    AntDesignOutlined,
    AudioOutlined,
    DislikeOutlined,
    EditOutlined,
    LikeOutlined,
    RedoOutlined,
    SyncOutlined
} from '@ant-design/icons';
import {Actions, type BubbleListProps} from '@ant-design/x';
import {Bubble, Sender, Think} from '@ant-design/x';
import XMarkdown, {type ComponentProps} from '@ant-design/x-markdown';
import {
    DeepSeekChatProvider, DefaultChatProvider,
    useXChat,
    type XModelParams,
    type XModelResponse,
    XRequest,
} from '@ant-design/x-sdk';
import {Avatar, Button, Divider, Flex, type GetRef, message, Skeleton, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {useAuth} from "@/provider/AuthProvider.tsx";
import type {AgentMessage, AIAgentMessage, MessageVO, StreamChatParam} from "@/types/chat.type.ts";
import type {TransformMessage} from "@ant-design/x-sdk/es/x-chat/providers/AbstractChatProvider";
import Mermaid from "@ant-design/x-markdown/plugins/Mermaid";
import HighlightCode from "@ant-design/x-markdown/plugins/HighlightCode";
import Latex from "@ant-design/x-markdown/plugins/Latex";
import {useTheme} from "@/provider/ThemeProvider.tsx";
import type {BubbleItemType} from "@ant-design/x/es/bubble/interface";

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

//const BASE_URL = 'https://api.x.ant.design/api/big_model_glm-4.5-flash';
//const BASE_URL = 'https://api.deepseek.com/chat/completions';
const BASE_URL = 'http://localhost:9500/chat/streamChat';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

//const MODEL = 'glm-4.5-flash';
const MODEL = 'deepseek-reasoner';
const MODEL_CHAT = 'deepseek-chat';
const API_KEY = 'sk-xxxx';

const chatId = '123'


class CustomChatProvider<
    ChatMessage extends AgentMessage = AgentMessage,
    Input extends StreamChatParam = StreamChatParam,
    Output extends MessageVO = MessageVO,
> extends DefaultChatProvider<ChatMessage, Input, Output> {

    /**
     * 转换发送消息
     */
    transformLocalMessage(requestParams: Partial<StreamChatParam>): ChatMessage {
        console.log('requestParams:', requestParams)
        const userMessage = {
            role: 'user',
            id: Date.now().toString(),
            content: requestParams.content,
        } as ChatMessage
        console.log('userMessage:', userMessage)
        return userMessage as ChatMessage;
    }

    /**
     * 转换 AI 返回消息
     */
    transformMessage(info: TransformMessage<ChatMessage, MessageVO>): ChatMessage {
        const {originMessage, chunk} = info;
        try {
            const data: MessageVO = JSON.parse(chunk?.data)
            const agentMessage = {
                role: 'ai',
                id: data.msgId,
                loading: !data.finished,
                reasoningContent: (originMessage?.reasoningContent || '') + (data.reasoningContent || ''),
                content: (originMessage?.content || '') + (data.content || ''),
            } as ChatMessage
            return agentMessage
        } catch (e) {
            console.log('Failed to transformMessage:', e)
        }
        return originMessage as ChatMessage
    }
}


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
            setExpand(false);
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

const TestXChat2 = () => {

    const [content, setcontent] = React.useState('');
    const [edit, setEdit] = useState(false)
    const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);


    const {user} = useAuth();

    const [provider] = React.useState(
        new CustomChatProvider<AgentMessage, StreamChatParam, MessageVO>({
            //request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
            request: XRequest<StreamChatParam, MessageVO>(BASE_URL, {
                manual: true,
                headers: {'Authorization': `Bearer ${user?.token}`},
                params: {
                    chatId: '',
                    content: '',
                    modelId: '',
                    openReasoning: false,
                    openSearch: false,
                },
                callbacks: {
                    onSuccess: messages => {

                        console.log('onSuccess', messages);
                    },
                    onError: error => {

                        console.error('onError', error);
                    },
                    onUpdate: msg => {

                        //console.log('onUpdate', JSON.stringify(msg));
                    },
                }
            },),

        }),
    );


    // Chat messages
    const {onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload} = useXChat({
        provider,
        requestPlaceholder: () => {
            return {
                id: Date.now().toString(),
                role: 'ai',
                content: '请稍后...',
            } as AgentMessage;
        },
        requestFallback: (_, {error}) => {
            if (error.name === 'AbortError') {
                return {
                    id: Date.now().toString(),
                    role: 'ai',
                    content: '请求被中断',
                } as AgentMessage;
            }
            return {
                id: Date.now().toString(),
                role: 'ai',
                content: '请求失败，请再试一次！',
            } as AgentMessage;
        },


    });

    /*useEffect(() => {
        console.log('messages:', JSON.stringify(messages))
    }, [messages]);*/

    const addUserMessage = () => {
        setMessages([
            ...messages,
            {
                id: Date.now(),
                message: {id: Date.now().toString(), role: 'user', content: 'Add a new user message'},
                status: 'success',
            },
        ]);
    };

    const addAIMessage = () => {
        setMessages([
            ...messages,
            {
                id: Date.now(),
                message: {id: Date.now().toString(), role: 'ai', content: 'Add a new AI response'},
                status: 'success',
            },
        ]);
    };

    const addSystemMessage = () => {
        setMessages([
            ...messages,
            {
                id: Date.now(),
                message: {id: Date.now().toString(), role: 'ai', content: 'Add a new system message'},
                status: 'success',
            },
        ]);
    };

    const editLastMessage = () => {
        const lastMessage = messages[messages.length - 1];
        setMessage(lastMessage.id, {
            message: {...lastMessage.message, content: 'Edit a message'},
        });
    };

    const finalMessages: BubbleItemType[] = messages.map(({id, status, message}) => {
        //console.log('message:', JSON.stringify(messages))
        const content = (message.reasoningContent ? `<think>${message.reasoningContent}</think>` : '')
            + (message.content || '')

        return ({
            key: message.id,
            role: message.role,
            status: status,
            content: content,
        })
    })


    const roles: BubbleListProps['role'] = {
        user: (data: BubbleItemType) => {
            const isLastMessage = false;


            return {
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
            }
        },
        ai: (data: BubbleItemType) => {
            const loading = data.status !== 'success';

            return {
                placement: 'start',
                shape: 'round',
                variant: 'borderless',
                avatar: () => <Avatar icon={<AntDesignOutlined/>}/>,
                //header: (<h3>Markdown</h3>),
                typing: {effect: 'fade-in'},
                contentRender: (content) => (
                    <XMarkdown
                        className={"x-markdown-light"}
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
                            onClick={handleActionClick}
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
        const {className, children} = props;
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
            <Skeleton.Image active style={{width: 60, height: 60}}/>,
        'loading-link': () =>
            <Skeleton.Button active size="small" style={{margin: '4px 0', width: 16, height: 16}}/>,
        'incomplete-table': () =>
            <Skeleton.Node active style={{width: 160}}/>,
        'incomplete-html': () =>
            <Skeleton.Node active style={{width: 383, height: 120}}/>,
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
        <Flex vertical gap="middle">
            <Flex vertical gap="middle">
                <div>
                    Current status:{' '}
                    {isRequesting
                        ? 'Requesting'
                        : messages.length === 0
                            ? 'No messages yet, please enter a question and send'
                            : 'Q&A completed'}
                </div>
                <Flex align="center" gap="middle">
                    <Button disabled={!isRequesting} onClick={abort}>
                        abort
                    </Button>
                    <Button onClick={addUserMessage}>Add a user message</Button>
                    <Button onClick={addAIMessage}>Add an AI message</Button>
                    <Button onClick={addSystemMessage}>Add a system message</Button>
                    <Button disabled={!messages.length} onClick={editLastMessage}>
                        Edit the last message
                    </Button>
                </Flex>
            </Flex>
            <Divider/>
            <Bubble.List
                role={roles}
                style={{height: 500}}
                items={finalMessages}
            />
            <Sender
                loading={isRequesting}
                value={content}
                onCancel={abort}
                onChange={setcontent}
                onSubmit={(nextContent) => {
                    onRequest({
                        //modelId: MODEL_CHAT,
                        openReasoning: true,
                        openSearch: true,
                        chatId: chatId,
                        content: nextContent,
                    });
                    setcontent('');
                }}
            />
        </Flex>
    );
};

export default TestXChat2;