import {create} from "zustand";
import {persist} from "zustand/middleware";

type Theme = 'dark' | 'light'

type State = {
    theme: Theme;
    dark: boolean;
}

type Action = {
    toggleTheme: () => void;
}

/**
 * 主题配置 全局状态管理
 */
export const useThemeStore = create<State & Action>()(
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