
import {createContext, useContext, useState} from "react";
import {useUserStore} from "@/stores/userStore.ts";
import type {LoginParam, LoginUser, RegisterParam} from "@/types/user.type.ts";
import {loginAPI, logoutAPI, registerAPI} from "@/apis/user/userApi.ts";


interface AuthContextType {
    user: LoginUser | null;
    isLogin: boolean;
    loading: boolean;
    register: (param:  RegisterParam) => Promise<void>;
    login: (param: LoginParam) => Promise<void>;
    logout: () => Promise<void>;
    clearUser: () => void;
}

/**
 * 创建认证上下文
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 认证 Hook
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.log('useAuth must be used within an AuthProvider')
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


/**
 * 用户登录认证组件
 */
export const AuthProvider = (
    {children}: { children: React.ReactNode }
) => {

    const {user, setUser} = useUserStore();
    const [loading, setLoading] = useState(false)


    /**
     * 处理注册
     */
    const handleRegister = async (param:  RegisterParam) => {
        try {
            setLoading(true)

            const resp = await registerAPI(param);
            if (resp.code === 200) {
                console.log('注册成功')
            } else {
                throw new Error(resp.message);
            }
        } catch (e: any) {
            console.log('注册失败：', e)
            throw new Error(e.message);
        } finally {
            setLoading(false)
        }
    }

    /**
     * 处理登录
     */
    const handleLogin = async (param: LoginParam) => {
        try {
            setLoading(true)
            const resp = await loginAPI(param);
            if (resp.code === 200) {
                console.log('登录成功')
                const token = resp.data;

                setUser({
                    username: param.username,
                    token: token,
                })
            } else {
                throw new Error(resp.message);
            }
        } catch (e: any) {
            console.log('登录失败：', e)
            throw new Error(e.message);
        } finally {
            setLoading(false)
        }
    }

    /**
     * 处理登出
     */
    const handleLogout = async () => {
        try {
            setLoading(true)
            const resp = await logoutAPI();
            if (resp.code === 200) {
                console.log('登出成功')
            } else {
                throw new Error(resp.message);
            }
        } catch (e: any) {
            console.log('登出失败：', e)
            throw new Error(e.message);
        } finally {
            setLoading(false)
            handleClearUser()
        }
    }

    const handleClearUser = () => {
        setUser(null)
    }


    const value = {
        user,
        isLogin: !!user?.token,
        loading: loading,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        clearUser: handleClearUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


