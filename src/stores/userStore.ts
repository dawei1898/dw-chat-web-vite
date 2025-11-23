import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {LoginUser} from "@/types/user.type.ts";
import {USER_KEY} from "@/utils/constant.ts";

type State = {
    user: LoginUser | null;
}

type Action = {
    setUser: (user: LoginUser | null) => void;
}

/**
 * 登录用户信息 全局状态管理
 */
export const useUserStore = create<State & Action>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: LoginUser | null) => set({user: user}),
        }),
        {
            name: USER_KEY, // 保存在 localStorage 中的 key
            partialize: (state) => ({
                user: state.user // 指定保存的字段
            }),
        }
    )
)