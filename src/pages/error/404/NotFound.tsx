import {Button, Result} from "antd";
import {Link} from "react-router";

const NotFoundPage = () => {
    return (
        <Result
            status='404'
            title='not found'
            subTitle='您访问的网页不存在！'
            extra={[
                <Link to={'/'}>
                    <Button type='primary'>
                        返回主页
                    </Button>
                </Link>
            ]}
        />
    );
};

export default NotFoundPage;