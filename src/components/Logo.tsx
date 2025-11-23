import React from 'react';
import {Flex, Image} from "antd";

const Logo = () => {
    return (
        <Flex justify='center' align='center'>
            <Image src={'/logo.svg'}  width={32} height={32} preview={false}/>
        </Flex>
    );
};

export default Logo;