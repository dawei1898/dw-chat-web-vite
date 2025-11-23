import {Button, Result} from "antd";
import {Link} from "react-router";

const ErrorPage = () => {
    return (
        <Result
            status='500'
            title='error'
            subTitle='服务器正在开小差，请耐心等候.....'
            extra={[
                <Link to={'/'}>
                    <Button type={'primary'}>
                        返回主页
                    </Button>
                </Link>
            ]}
        />
    );
};

export default ErrorPage;