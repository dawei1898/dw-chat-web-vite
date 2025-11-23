/**
 * 注册参数
 */
export interface RegisterParam {
    username?: string;
    email?: string;
    password: string;
}

/**
 * 登录参数
 */
export interface LoginParam {
    username: string;
    password: string;
}

/**
 * 已登录用户信息
 */
export interface LoginUser {
    username: string;
    token: string;
}