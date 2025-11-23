import {axioser} from "@/utils/httpUtil.ts";
import type { LoginParam, RegisterParam } from '@/types/user.type.ts'
import type {ApiResponse} from "@/types";



/**
 * 用户注册 API
 */
export function registerAPI(param: RegisterParam) {
  return axioser.post<any, ApiResponse<string>>('/user/register', param)
}

/**
 * 用户登录
 */
export function loginAPI(param: LoginParam) {
    return axioser.post<any, ApiResponse<string>>('/user/login', param)
}

/**
 * 退出登录
 */
export function logoutAPI() {
    return axioser.delete<any, ApiResponse>('/user/logout')
}


