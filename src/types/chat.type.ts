import type { PageParam } from '@/types'
import {DefaultChatProvider} from "@ant-design/x-sdk";
import type {TransformMessage} from "@ant-design/x-sdk/es/x-chat/providers/AbstractChatProvider";


export type VoteType = 'up' | 'down' | ''

export type Role = 'user' | 'assistant'

export interface MessageVo {
  msgId: string,
  chatId: string,
  type: string;
  role: string,
  content: string,
  reasoningContent: string,
  tokens?: number,
  modelId: string,
  createTime?: string,
  voteType?: VoteType,
  loading?: boolean,
}

/**
 * 对话消息表
 */
export type Message = {
  msgId: string,
  rawMsgId: string,
  chatId: string,
  role: string,
  content: string,
  reasoningContent: string,
  tokens: number,
  modelId: string,
  userId: string,

};

/**
 * 会话记录
 */
export interface ChatRecord {
  chatId: string;
  chatName: string;
}

/**
 * 会话记录返参
 */
export interface ChatRecordVO extends ChatRecord {
  createTime: string;
  updateTime: string;
}

/**
 * 分查询会话记录入参
 */
export interface RecordPageParam extends PageParam {
  chatName: string
}

/**
 * 流式对话入参
 */
export interface StreamChatParam {
  chatId: string;
  content: string;
  modelId?: string;
  openReasoning?: boolean;
  openSearch?: boolean;
}

/**
 * 对话消息返参
 */
export interface MessageVO {
  msgId: string;
  chatId: string;
  type: string;
  content: string;
  reasoningContent?: string;
  voteType?: string;
  modelId?: string;
  finished?: boolean;
}


export type UserAgentMessage = {
  role: 'user';
  id: string;
  content: string;
  reasoningContent?: string;
  chatId?: string;
  openReasoning?: boolean;
  openSearch?: boolean;
  voteType?: VoteType;
};

export type AIAgentMessage = {
  role: 'ai';
  id: string;
  content: string;
  reasoningContent?: string;
  chatId?: string;
  voteType?: VoteType;
  loading?: boolean;
  openReasoning?: boolean;
  openSearch?: boolean;
};

export type AgentMessage = UserAgentMessage | AIAgentMessage;

/**
 * 点赞评论入参
 */
export interface VoteParam {
  contentId: string;
  voteType: string;
}



export class CustomChatProvider<
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