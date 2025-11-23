import React, {
    createContext, type ReactNode, useContext, useEffect
} from 'react';
import {
    type ThemeAction, type ThemeState, useThemeStore
} from "@/stores/themeStore.ts";


interface ThemeContextType extends ThemeState, ThemeAction {
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const useTheme = () => {
    const content = useContext(ThemeContext);
    if (content === undefined) {
        throw new Error('useTheme 必须在 ThemeProvider 内使用');
    }
    return content;
}


/**
 * 主题 Provider
 *
 * @param children
 * @constructor
 */
export const ThemeProvider = (
    {children}: { children: ReactNode }
) => {

    const {theme, dark, toggleTheme} = useThemeStore();


    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        root.classList.add(theme)
    }, [theme])

    const value = {theme, dark, toggleTheme}

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;