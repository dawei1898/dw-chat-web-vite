import React from 'react';
import {Typography} from "antd";
import {DeepSeekIcon} from "@/components/icon/Icons.tsx";

const Welcome = () => {
    return (
        <div className='flex justify-center items-start gap-4 my-4'>
            <div>
                <DeepSeekIcon size={32}/>
            </div>

            <Typography.Title level={3}>
                今天有什么可以帮到你？
            </Typography.Title>
        </div>
    );
};

export default Welcome;