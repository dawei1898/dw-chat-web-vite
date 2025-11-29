import React, {
    createContext, useContext, useEffect, useState
} from 'react';


export type Theme = 'dark' | 'light'

interface ThemeContextType  {
    theme: Theme;
    dark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const useTheme = () => {
    const content = useContext(ThemeContext);
    if (content === undefined) {
        throw new Error('useTheme 必须在 ThemeProvider 内使用');
    }
    return content;
}

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

/**
 * 主题切换 Provider
 *
 * @param children
 * @param defaultTheme
 * @param storageKey
 * @param props
 * @constructor
 */
export const ThemeProvider = (
    {children, defaultTheme = "light", storageKey = "theme", ...props}: ThemeProviderProps
) => {

    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )


    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        dark: theme === 'dark',
        toggleTheme: () => {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        }
    }

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;