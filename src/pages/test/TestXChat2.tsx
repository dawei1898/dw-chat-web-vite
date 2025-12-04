import {SyncOutlined} from '@ant-design/icons';
import type {BubbleListProps} from '@ant-design/x';
import {Bubble, Sender, Think} from '@ant-design/x';
import XMarkdown, {type ComponentProps} from '@ant-design/x-markdown';
import {
    DeepSeekChatProvider, DefaultChatProvider,
    useXChat,
    type XModelParams,
    type XModelResponse,
    XRequest,
} from '@ant-design/x-sdk';
import {Button, Divider, Flex, Tooltip} from 'antd';
import React, {useEffect} from 'react';
import {useAuth} from "@/provider/AuthProvider.tsx";
import type {AgentMessage, AIAgentMessage, MessageVO, StreamChatParam} from "@/types/chat.type.ts";
import type {TransformMessage} from "@ant-design/x-sdk/es/x-chat/providers/AbstractChatProvider";

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

//const BASE_URL = 'https://api.x.ant.design/api/big_model_glm-4.5-flash';
const BASE_URL = 'https://api.deepseek.com/chat/completions';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

//const MODEL = 'glm-4.5-flash';
const MODEL = 'deepseek-reasoner';
const MODEL_CHAT = 'deepseek-chat';
const API_KEY = 'sk-xxxx';

const ThinkComponent = React.memo((props: ComponentProps) => {
    const [title, setTitle] = React.useState('Deep thinking...');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (props.streamStatus === 'done') {
            setTitle('Complete thinking');
            setLoading(false);
        }
    }, [props.streamStatus]);

    return (
        <Think title={title} loading={loading}>
            {props.children}
        </Think>
    );
});

const role: BubbleListProps['role'] = {
    assistant: {
        placement: 'start',
        contentRender(content: string) {
            // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
            const newContent = content.replace('/\n\n/g', '<br/><br/>');
            return (
                <XMarkdown
                    content={newContent}
                    components={{
                        think: ThinkComponent,
                    }}
                />
            );
        },
    },
    user: {
        placement: 'end',
    },
};


class CustomChatProvider<
    ChatMessage extends AgentMessage = AgentMessage,
    Input extends StreamChatParam = StreamChatParam,
    Output extends MessageVO = MessageVO,
> extends DefaultChatProvider<ChatMessage, Input, Output>  {

    transformLocalMessage(requestParams: Partial<StreamChatParam>): ChatMessage {
        console.log('requestParams:', requestParams)
        const userMessage  = {
            type: 'user',
            id: Date.now().toString(),
            content: requestParams.content,
        } as ChatMessage
        console.log('userMessage:',userMessage)
        return userMessage as ChatMessage;
    }

    transformMessage(info: TransformMessage<ChatMessage, MessageVO>): ChatMessage {
        console.log('info:', info)
        const {originMessage, chunk} = info;
        console.log('originMessage:', info.originMessage)
        console.log('chunk:', info.chunk)
        try {
            const data: MessageVO = JSON.parse(chunk.data)
            console.log('MessageVO:', JSON.stringify(data))
            const agentMessage  = {
                reasoningContent: (originMessage?.reasoningContent || '') + (data.reasoningContent || ''),
                content: (originMessage?.content || '') + (data.content || ''),
                type: 'ai',
                id: data.msgId,
                loading: !data.finished,
            } as ChatMessage
            console.log('agentMessage:',agentMessage)
            return agentMessage
        } catch (e) {
            console.log('Failed to transformMessage:', e)
            return originMessage as ChatMessage
        }
    }


}

const TestXChat2 = () => {

    const [content, setContent] = React.useState('');

    const {user} = useAuth();

    const [provider] = React.useState(
        new CustomChatProvider<AgentMessage, StreamChatParam, MessageVO>({
            //request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
            request: XRequest<StreamChatParam, MessageVO>('http://localhost:9500/chat/streamChat', {
                manual: true,
                //headers: {'Authorization': `Bearer ${API_KEY}`},
                /*params: {
                    model: MODEL,
                    stream: true,
                },*/
                headers: {'Authorization': `Bearer ${user?.token}`},
                params: {
                    modelId: MODEL,
                    chatId: '',
                    content: '',
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
    const {onRequest, messages, setMessages, parsedMessages, setMessage, isRequesting, abort, onReload} = useXChat({
        provider,
        /*requestFallback: (_, { error }) => {
            if (error.name === 'AbortError') {
                return {
                    content: 'Request is aborted',
                    role: 'assistant',
                };
            }
            return {
                content: 'Request failed, please try again!',
                role: 'assistant',
            };
        },
        requestPlaceholder: () => {
            return {
                content: 'Please wait...',
                role: 'assistant',
            };
        },*/
        // 取消注释并完善parser函数
        /*parser: (message) => {
            console.log('parser message:', JSON.stringify(message))
            // 确保返回正确的消息格式
            if (message?.data) {
                const data: AgentMessage = JSON.parse(message?.data)
                console.log('parser data:', JSON.stringify(data))
                return data
            }
            return message
        }*/

    });

    useEffect(() => {
        console.log('messages:', JSON.stringify(messages))
    }, [messages]);

    const addUserMessage = () => {
        setMessages([
            ...messages,
            {
                id: Date.now(),
                message: {role: 'user', content: 'Add a new user message'},
                status: 'success',
            },
        ]);
    };

    const addAIMessage = () => {
        setMessages([
            ...messages,
            {
                id: Date.now(),
                message: {role: 'assistant', content: 'Add a new AI response'},
                status: 'success',
            },
        ]);
    };

    const addSystemMessage = () => {
        setMessages([
            ...messages,
            {
                id: Date.now(),
                message: {role: 'system', content: 'Add a new system message'},
                status: 'success',
            },
        ]);
    };

    const editLastMessage = () => {
        const lastMessage = messages[messages.length - 1];
        setMessage(lastMessage.id, {
            message: {role: lastMessage.message.role, content: 'Edit a message'},
        });
    };

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
                role={role}
                style={{height: 500}}
                items={messages.map(({id, message}) => {
                    console.log('message:', JSON.stringify(messages))

                    return ({
                        key: id,
                        role: message.type,
                        content: message.content,
                        components:
                            message.type === 'ai'
                                ? {
                                    footer: (
                                        <Tooltip title="Retry">
                                            <Button
                                                size="small"
                                                type="text"
                                                icon={<SyncOutlined/>}
                                                style={{marginInlineEnd: 'auto'}}
                                                /*onClick={() =>
                                                    onReload(id, {
                                                        userAction: 'retry',
                                                    })
                                                }*/
                                            />
                                        </Tooltip>
                                    ),
                                }
                                : {},
                    })
                })}
            />
            <Sender
                loading={isRequesting}
                value={content}
                onCancel={() => {
                    abort();
                }}
                onChange={setContent}
                onSubmit={(nextContent) => {
                    onRequest({
                        /*model: MODEL_CHAT,
                        messages: [
                            {
                                role: 'user',
                                content: nextContent,
                            },
                        ],*/
                        modelId: MODEL_CHAT,
                        chatId: '1234',
                        content: nextContent,
                    });
                    setContent('');
                }}
            />
        </Flex>
    );
};

export default TestXChat2;