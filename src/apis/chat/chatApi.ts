import {axioser} from "@/utils/httpUtil.ts";
import type { ApiResponse, PageResult } from '@/types'
import type {
  ChatRecord, ChatRecordVO, MessageVo,
  RecordPageParam, VoteParam
} from '@/types/chat.type.ts'


/**
 * 查询会话列表 API
 */
export function queryChatPageAPI(param: RecordPageParam) {
  const url = `/chat/queryChatPage`;
    return axioser.post<any, ApiResponse<PageResult<ChatRecordVO>>>(url, param)
}


/**
 * 保存会话 API
 */
export const  saveChatAPI = async (param: ChatRecord) => {
  const url = `/chat/saveChat`;
  return axioser.post<any, ApiResponse<string>>(url, param)
}


/**
 * 删除会话 API
 */
export const  deleteChatAPI = async (chatId: string) => {
  const url = `/chat/deleteChat/${chatId}`;
  return axioser.delete<any, ApiResponse<number>>(url)
}


/**
 * 查询当前会话消息列表
 */
export const  queryMessageListAPI = async (chatId: string) => {
  const url = `/chat/queryMessageList/${chatId}`;
  return axioser.get<any, ApiResponse<MessageVo[]>>(url)
}


/**
 * 点赞/踩 API
 */
export const  saveVoteAPI = async (param: VoteParam) => {
  const url = "/vote/saveVote";
  return axioser.post<any, ApiResponse<string>>(url, param)
}
