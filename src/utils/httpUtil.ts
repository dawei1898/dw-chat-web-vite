import axios from "axios";
import {useUserStore} from "@/stores/userStore.ts";


/**
 * 创建实例
 */
export const axioser = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60000
});


/**
 * 添加请求拦截器
 */
axioser.interceptors.request.use(
    // 拦截请求，增加token
    config => {
        // 直接从store实例获取状态，而不是通过hook
        const userStore = useUserStore.getState();
        if (userStore.user?.token) {
            //console.log(`token : ${token}`)
            config.headers['Authorization'] = `Bearer ${userStore.user.token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)


/**
 * 添加响应拦截器
 */
axioser.interceptors.response.use(
    // 成功返回
    resp => {
        if (resp.data.code === 401) {
            // 清楚 tokenn
            useUserStore.getState().setUser(null)
            console.log('token失效，转跳到登录页')
            window.location.href = '/login'
        }

        return resp.data
    },
    // 错误返回
    error => {
        console.log(`response error: ${JSON.stringify(error)}`)
        return Promise.reject(error)
    }
)
