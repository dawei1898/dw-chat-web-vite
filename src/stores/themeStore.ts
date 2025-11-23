import {create} from "zustand";
import {persist} from "zustand/middleware";

export type Theme = 'dark' | 'light'

export type ThemeState = {
    theme: Theme;
    dark: boolean;
}

export type ThemeAction  = {
    toggleTheme: () => void;
}

/**
 * 主题配置 全局状态管理
 */
export const useThemeStore = create<ThemeState & ThemeAction>()(
    persist(
        (set) => ({
            theme: 'light',
            dark: false,
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                return {
                    theme: newTheme,
                    dark: newTheme === 'dark'
                };
            }),
        }),
        {
            name: 'theme', // localStorage中的键名
            partialize: (state) => ({ // 只保存需要的字段
                theme: state.theme,
                dark: state.dark,
            })
        }
    )
)