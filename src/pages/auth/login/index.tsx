import React from 'react';
import LoginForm from "./LoginForm.tsx";


/**
 * 登录页面
 */
const LoginIndex = () => {
    return (
        <div className='min-h-screen w-full flex justify-center items-center bg-blue-50'>
            <div className='max-w-xl'>
                 <LoginForm/>
            </div>
        </div>
    );
};

export default LoginIndex;