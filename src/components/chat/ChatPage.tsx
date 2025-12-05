import React, {useEffect, useState} from 'react';
import {message} from "antd";
import {queryMessageListAPI, saveChatAPI, saveVoteAPI} from "@/apis/chat/chatApi.ts";
import {type MessageInfo, useXChat, XRequest} from "@ant-design/x-sdk";
import {
    type AgentMessage,
    CustomChatProvider,
    type MessageVO,
    type StreamChatParam,
    type VoteType
} from "@/types/chat.type.ts";
import {appConfig} from "@/utils/appConfig.ts";
import type {BubbleItemType} from "@ant-design/x";
import ChatMessages from "@/components/chat/ChatMessages.tsx";
import ChatSender from "@/components/chat/ChatSender.tsx";
import type {LoginUser} from "@/types/user.type.ts";
import Welcome from "@/components/chat/Welcome.tsx";
import {useAppChat} from "@/provider/AppChatProvider.tsx";

interface ChatPageProps {
    user: LoginUser | null,
    chatId?: string,
}

/**
 * 对话页面组件
 */
const ChatPage = (
    props: ChatPageProps
) => {

    const [messageApi, contextHolder] = message.useMessage();
    const { chatId, setChatId } = useAppChat();
    const [loading, setLoading] = useState<boolean>(false);
    console.log('ChatPage props.chatId: ', props.chatId)
    console.log('ChatPage chatId: ', chatId)

    useEffect(() => {
        if (props.chatId !== chatId) {
            setChatId(props.chatId || '');
        }
    }, [props.chatId, chatId]);

    useEffect(() => {
        if (chatId) {
            queryMessageList(chatId).then()
        }
    }, [chatId]);


    /**
     * 查询消息列表
     */
    const queryMessageList = async (conversationKey: string) => {
        if (!conversationKey || loading) {
            return;
        }

        try {
            setLoading(true);
            const resp = await queryMessageListAPI(conversationKey)
            // @ts-ignore
            const msgs: MessageInfo<AgentMessage>[] = resp.data.map((item) => ({
                id: item.msgId,
                status: item.type === 'user' ? 'local' : 'success',
                message: {
                    id: item.msgId,
                    role: item.type,
                    content: item.content,
                    reasoningContent: item.reasoningContent,
                    chatId: item.chatId,
                    voteType: item.voteType,
                }
            }))
            setMessages(msgs)
        } catch (e) {
            console.log('Failed to queryMessageList.', e)
        } finally {
            setLoading(false)
        }
    }

    const [provider] = React.useState(
        new CustomChatProvider<AgentMessage, StreamChatParam, MessageVO>({
            request: XRequest<StreamChatParam, MessageVO>(
                `${appConfig.apiStreamChatUrl}`, {
                    manual: true,
                    //streamTimeout: 60,
                    headers: {'Authorization': `Bearer ${props.user?.token}`},
                    params: {
                        chatId: '',
                        content: '',
                        modelId: '',
                        openReasoning: false,
                        openSearch: false,
                    },
                },),
        }),
    );


    // Chat messages
    const {onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload} = useXChat({
        provider,
        /*requestPlaceholder: () => {
            return {
                id: Date.now().toString(),
                role: 'ai',
                content: '请稍后...',
            } as AgentMessage;
        },*/
        requestFallback: (_, {error}) => {
            console.log('requestFallback error:', JSON.stringify(error))

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


    const finalMessages: BubbleItemType[] = messages.map(({id, status, message}) => {
        //console.log('message:', JSON.stringify(messages))
        const content = (message.reasoningContent ? `<think>${message.reasoningContent}</think>` : '')
            + (message.content || '')

        return ({
            key: message.id,
            role: message.role,
            status: status,
            content: content,
            extraInfo: {
                voteType: message.voteType
            }
        })
    })


    const handleSubmit = async (content: string, openReasoning: boolean, openSearch: boolean) => {
        let id: string | undefined  = chatId;
        if (!id) {
            // 添加加载状态防止重复提交
            if (loading) return;

            setLoading(true);

            try {
                id = await addConversation(content);
                if (id) {
                    console.log('新增会话成功, chatId:', id)
                    setChatId(id)
                    window.history.replaceState({}, '', `/chat/${id}`);

                    setTimeout(() => {
                        onRequest({
                            chatId: id,
                            content: content,
                            openReasoning: openReasoning,
                            openSearch: openSearch,
                        });
                    }, 500)
                }
            } finally {
                setLoading(false);
            }

        } else {
            onRequest({
                chatId: id,
                content: content,
                openReasoning: openReasoning,
                openSearch: openSearch,
            });
        }

    }

    // 添加会话
    const addConversation = async (msg: string) => {
        if (msg) {
            let chatId: string = ''
            const chatName = msg.length > 10 ? msg.substring(0, 10) : msg
            const resp = await saveChatAPI({chatId, chatName})
            if (resp.code === 200) {
                // 初始化会话记录列表
                // await initConversations()
                return resp.data;
            }
        }
    };


    /**
     * 消息点赞
     */
    const msgLike = async (msgId: string, voteType: VoteType) => {
        voteType = voteType === 'up' ? '' : 'up'
        await saveVoteAPI({contentId: msgId, voteType: voteType})

        const message = messages.filter(m => m.id === msgId)[0];
        setMessage(message.id, {
            message: {...message.message, voteType: voteType},
        });

        if (voteType === 'up') {
            messageApi.success('感谢您的支持')
        }
    }

    /**
     * 消息点踩
     */
    const msgDislike = async (msgId: string, voteType: VoteType) => {
        voteType = voteType === 'down' ? '' : 'down'
        await saveVoteAPI({contentId: msgId, voteType: voteType})

        const message = messages.filter(m => m.id === msgId)[0];
        setMessage(message.id, {
            message: {...message.message, voteType: voteType},
        });
        if (voteType === 'down') {
            messageApi.info('感谢您的反馈')
        }
    }

    if (!chatId) {
        return (
            <div className='h-lvh w-full flex flex-col justify-center items-center p-4'>
                <Welcome/>

                {/* 发送框 */}
                <ChatSender
                    onRequest={handleSubmit}
                    onStop={abort}
                    isRequesting={isRequesting}
                />
            </div>
        )
    }

    return (
        <>
            {contextHolder}
            <div className='h-[97vh]  flex flex-col justify-center items-center'>
                {/* 消息列表 */}
                <div className='h-full w-full px-1 overflow-y-auto scrollbar-container'>
                    <ChatMessages
                        messages={finalMessages}
                        onLike={msgLike}
                        onDislike={msgDislike}
                    />
                </div>

                {/* 发送框 */}
                <div className='w-full mt-auto'>
                    <ChatSender
                        chatId={chatId}
                        onRequest={handleSubmit}
                        onStop={abort}
                        isRequesting={isRequesting}
                    />
                </div>
            </div>
        </>
    );
};

export default ChatPage;