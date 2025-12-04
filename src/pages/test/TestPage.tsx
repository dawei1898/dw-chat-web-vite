import React from 'react';
import TestXChat from "@/pages/test/TestXChat.tsx";
import TestXChat2 from "@/pages/test/TestXChat2.tsx";
import {AuthProvider} from "@/provider/AuthProvider.tsx";

const TestPage = () => {
    return (
        <div className='flex flex-col h-lvh w-full p-4'>
            <AuthProvider>
                <h3>test</h3>
                <TestXChat2/>
            </AuthProvider>

        </div>
    );
};

export default TestPage;