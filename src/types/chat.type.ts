import type { PageParam } from '@/types'


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
}

/**
 * 点赞评论入参
 */
export interface VoteParam {
  contentId: string;
  voteType: string;
}