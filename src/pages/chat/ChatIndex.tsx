import React, {useEffect} from 'react';
import SidebarTrigger from "@/components/sidebar/SidebarTrigger.tsx";
import ChatSender from "@/components/chat/ChatSender.tsx";
import ChatMessages from "@/components/chat/ChatMessages.tsx";
import type {AgentMessage, MessageVO, StreamChatParam} from "@/types/chat.type.ts";
import {DefaultChatProvider, type MessageInfo, useXChat, XRequest} from "@ant-design/x-sdk";
import type {TransformMessage} from "@ant-design/x-sdk/es/x-chat/providers/AbstractChatProvider";
import {useParams} from "react-router";
import {queryMessageListAPI} from "@/apis/chat/chatApi.ts";
import {appConfig} from "@/utils/appConfig.ts";
import type {BubbleItemType} from "@ant-design/x";
import {useAuth} from "@/provider/AuthProvider.tsx";


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
            // @ts-ignore
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

const ChatIndex = () => {
    const { chatId } = useParams<{ chatId: string }>();
    console.log('chatId：', chatId)
    const {user} = useAuth();

    useEffect(() => {
        if (chatId) {
            queryMessageList(chatId).then()
        }
    }, [chatId]);


    /**
     * 查询消息列表
     */
    const queryMessageList = async (conversationKey: string) => {
        if (!conversationKey) {
            return
        }
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
        } ))
        setMessages(msgs)
    }

    const [provider] = React.useState(
        new CustomChatProvider<AgentMessage, StreamChatParam, MessageVO>({
            request: XRequest<StreamChatParam, MessageVO>(
                `${appConfig.apiStreamChatUrl}`, {
                    manual: true,
                    headers: {'Authorization': `Bearer ${user?.token}`},
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
        })
    })


    const handleSubmit = (content: string, openReasoning: boolean, openSearch: boolean) => {
        onRequest({
            //modelId: MODEL_CHAT,
            openReasoning: openReasoning,
            openSearch: openSearch,
            chatId: chatId,
            content: content,
        });

    }

    return (
        <div>
            <div className='fixed z-10 h-12 w-12 mt-2 ml-2'>
                <SidebarTrigger/>
            </div>
            <div className='h-[97vh]  flex flex-col justify-center items-center'>
                {/* 消息列表 */}
                <div className='h-full w-full px-1 overflow-y-auto scrollbar-container'>
                    <ChatMessages messages={finalMessages}/>
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
        </div>
    );
};

export default ChatIndex;