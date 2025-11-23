import React from 'react';
import {appConfig} from "@/utils/appConfig.ts";

const Title = () => {
    return (
        <>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 ml-2">
                 {appConfig.appName}
            </span>
        </>
    );
};

export default Title;