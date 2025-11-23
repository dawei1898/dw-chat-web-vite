import {createBrowserRouter, useRouteError} from "react-router";
import NotFoundPage from "@/pages/error/404/NotFound.tsx";
import ErrorPage from "@/pages/error/500/Error.tsx";
import App from "@/App.tsx";
import LoginIndex from "@/pages/auth/login";

/**
 * 根据错误类型跳转到对应的页面
 */
function GeneralErrorBoundary() {
    const error: any = useRouteError();
    if (error.status === 404) {
        return <NotFoundPage/>;
    } else {
        return <ErrorPage/>;
    }
}

/**
 * 页面路由
 */
const Router = createBrowserRouter([
    {
        path: "/",
        //Component: HomeLayout,
        errorElement: <GeneralErrorBoundary/>,
        //handle: {breadcrumb: "首页"},
        children: [


        ]
    },
    {
        path: "/error",
        children: [
            {
                path: "404",
                Component: NotFoundPage,
            },
            {
                path: "500",
                Component: ErrorPage,
            }
        ]
    },
    {
        path: "/home",
        element: <App/>,
    },
    {
        path: "/login",
        Component: LoginIndex,
    },

])

export default Router