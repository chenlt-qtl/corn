import React, { useState } from 'react';
import { Form, Input, Modal, Button, Spin, message } from 'antd';
import { connect } from 'umi';
import styles from './styles.less';

const FormItem = Form.Item;

export interface WordProps {
    articleId: string;
    modalVisible: boolean;
    onCancel: (reload: boolean) => void;
}


const WordEditModal: React.FC<WordProps> = (props) => {
    const { modalVisible, onCancel, articleId } = props;
    const [wordName, setWordName] = useState<string>("");
    const [word, setWord] = useState<object>({});
    const [disableAdd, setDisableAdd] = useState<boolean>(true);
    const [disableSearch, setDisableSearch] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);



    const handleCancel = (reload: boolean) => {
        onCancel(reload);
    }

    const handleSumbit = () => {
        if (!wordName) {
            message.error('请输入要增加的单词');
        } else {
            setLoading(true);
            props.dispatch({
                type: 'word/addArticleWordRel',
                payload: { wordId: word.id, articleId }
            }).then((res) => {
                setLoading(false);
                if (res.success) {
                    message.success('添加成功');
                    handleCancel(true);
                } else {
                    message.error(res.msg);
                }
            })
        }

    }

    const handleChange = e => {
        setWordName(e.target.value);
        setDisableAdd(true);
        if(e.target.value){
            setDisableSearch(false);
        }else{
            setDisableSearch(true);
        }
    }

    const handleSearch = e => {
        if (e.keyCode === 13) {
            if (wordName) {
                props.dispatch({
                    type: 'word/getWordByWordName',
                    payload: { wordName }
                }).then((res: WordItem) => {
                    if (res) {
                        setWord(res);
                        setDisableAdd(false);
                    } else {
                        setWord({});
                        setDisableAdd(true);
                    }
                })
            }
        }
    }
    const spinning = props.loading.effects["word/getWordByWordName"] || loading;

    return (
        <Modal
            title="增加单词"
            visible={modalVisible}
            onCancel={() => handleCancel(false)}
            style={{ top: 20 }}
            footer={<>
                <Button onClick={handleSumbit} disabled={disableSearch}>
                    查询
                </Button>
                <Button type="primary" onClick={handleSumbit} disabled={disableAdd}>
                    增加
                </Button>
                {/* <Button onClick={() => handleCancel(false)}>取消</Button> */}
            </>}
        >
            <Spin spinning={spinning}>
                <FormItem name="content" label="单词"
                    rules={[{ required: true, message: '请输入单词！' }]}>
                    <Input onChange={handleChange} onKeyUp={handleSearch}></Input>
                </FormItem>
                <div className={styles.acceptation}>
                    {word.acceptation?.split("|").map((text, index) => <p key={index}>{text}</p>)}
                </div>
            </Spin>
        </Modal>
    );
};

export default connect(({ loading }: { loading }) => (
    { loading }))(WordEditModal);