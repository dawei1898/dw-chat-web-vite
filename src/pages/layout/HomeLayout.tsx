import React from 'react';
import {Outlet} from "react-router";

const HomeLayout = () => {
    return (
        <div>
            <h3>首页布局</h3>
            <p>侧边栏</p>
            <Outlet/>
        </div>
    );
};

export default HomeLayout;