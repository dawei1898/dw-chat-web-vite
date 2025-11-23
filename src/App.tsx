import {Button} from "antd";
import {Sender} from "@ant-design/x";

function App() {


    return (
        <div className='flex flex-col min-h-svh justify-center items-center gap-4 p-4'>
            <h3>Hello World</h3>
            <p>This is a vite app</p>

            <Button type='primary'>
                发送
            </Button>

            <div className='w-full max-w-2xl'>
                <Sender/>
            </div>

        </div>
    )
}

export default App
