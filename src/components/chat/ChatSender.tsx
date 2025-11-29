import React, {useState} from 'react';
import {Attachments, type AttachmentsProps, Sender} from "@ant-design/x";
import {Button, Flex, type GetProp, type GetRef, message, theme, Tooltip} from "antd";
import {CloudUploadOutlined, GlobalOutlined, NodeIndexOutlined, PaperClipOutlined} from "@ant-design/icons";

const {useToken} = theme;


/**
 * 对话发送框
 */
const ChatSender = () => {

    const {token} = useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const senderRef = React.useRef<GetRef<typeof Sender>>(null);
    const [input, setInput] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [openAttachment, setOpenAttachment] = useState<boolean>(false)
    const [openSearch, setOpenSearch] = useState(false);
    const [openReasoning, setOpenReasoning] = useState(false);
    const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);
    const [files, setFiles] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);


    const handleSend = (context: string) => {
        setLoading(true)

        setInput('')
        setFiles([])

        setTimeout(() => {

            messageApi.success('发送成功:' + context)
            setLoading(false)
        }, 2000)
    }

    const handleStop = () => {
        messageApi.warning('停止发送')
        setLoading(false)
    }

    const iconStyle = {
        fontSize: 18,
        color: token.colorText,
    };

    return (
        <>
            {contextHolder}
            <Sender
                className='w-full max-w-md mx-auto'
                styles={{
                    root: {
                        borderRadius: '20px',

                    },
                }}
                ref={senderRef}
                placeholder='请输入你的问题...'
                autoSize={{
                    minRows: 2,
                    maxRows: 6,
                }}
                loading={loading}
                //disabled={loading}
                value={input}
                onChange={setInput}
                allowSpeech
                onSubmit={handleSend}
                onCancel={handleStop}
                suffix={false}
                onPasteFile={(fileList) => {
                    console.log('paste fileList:', fileList)
                    for (const file of fileList) {
                        attachmentsRef.current?.upload(file);
                    }
                    setOpenAttachment(true);

                }}
                header={openAttachment &&
                    <Sender.Header title='附件'>
                        <Attachments
                            ref={attachmentsRef}
                            overflow='wrap'
                            multiple
                            items={files}
                            onChange={(info) => setFiles(info.fileList)}
                            beforeUpload={() => false}
                            placeholder={{
                                icon:<CloudUploadOutlined style={{fontSize: 18}}/>,
                                description: '上传附件'
                            }}
                            getDropContainer={() => senderRef.current?.nativeElement}
                        />
                    </Sender.Header>
                }

                footer={(_, {components}) => {
                    const {SendButton, LoadingButton, SpeechButton} = components;

                    return (
                        <Flex gap='small'>
                            <Tooltip title={'上传附件'} placement='top'>
                                <Button
                                    type='text'
                                    icon={<PaperClipOutlined/>}
                                    onClick={() => setOpenAttachment(!openAttachment)}
                                />
                            </Tooltip>
                            <Tooltip title={'先思考后回答，解决推理问题'} placement='top'>
                                <Sender.Switch
                                    value={openReasoning}
                                    onChange={(value) => {
                                        setOpenReasoning(value)
                                        messageApi.success(value ? '已开启深度思考' : '已关闭深度思考')
                                    }}
                                >
                                    <NodeIndexOutlined/>
                                    深度思考
                                </Sender.Switch>
                            </Tooltip>
                            <Tooltip title={'按需搜索网页'} placement='top'>
                                <Sender.Switch
                                    value={openSearch}
                                    onChange={(value) => {
                                        setOpenSearch(value)
                                        messageApi.success(value ? '已开启联网搜索' : '已关闭联网搜索')
                                    }}
                                    icon={<GlobalOutlined/>}
                                >

                                    联网搜索
                                </Sender.Switch>
                            </Tooltip>


                            <div className='flex gap-2 ml-auto'>
                                {/* 语音按钮 */}
                                <SpeechButton
                                    style={{fontSize: 16}}
                                />

                                {/* 发送、停止按钮 */}
                                {!loading ? (<SendButton/>)
                                    : (<LoadingButton/>)
                                }
                            </div>
                        </Flex>
                    )
                }}


            />
        </>
    );
};

export default ChatSender;