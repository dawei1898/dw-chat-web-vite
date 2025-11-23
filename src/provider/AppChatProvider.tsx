import React, {createContext, useContext, useState} from 'react';


interface AppChatProviderContextType {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

/**
 * 创建上下文
 */
const AppChatProviderContext = createContext<AppChatProviderContextType | undefined>(undefined);


/**
 * 使用上下文
 */

export const useAppChat = () => {
    const context = useContext(AppChatProviderContext)
    if (!context) {
        console.log('useAuth must be used within an AppChatProvider')
        throw new Error('useAuth must be used within an AppChatProvider');
    }
    return context;
}

/**
 *
 * @param children
 * @constructor
 */
const AppChatProvider = (
    {children}: {children: React.ReactNode}
) => {

    const [collapsed, setCollapsed] = useState(false)


    const value = {
        collapsed: collapsed,
        setCollapsed: setCollapsed
    }

    return (
        <AppChatProviderContext.Provider value={value}>
            {children}
        </AppChatProviderContext.Provider>
    );
};

export default AppChatProvider;