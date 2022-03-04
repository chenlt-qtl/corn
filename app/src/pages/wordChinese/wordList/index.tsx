import React, { useEffect, useRef, useState } from 'react';

import { Empty, Spin, Modal, Button } from 'antd';
import styles from './styles.less';
import { WordCnItem } from '@/data/word';
import { PlusCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import WordEditModal from './WordEditModal';
import { editWord } from '../service'
import TextArea from 'antd/lib/input/TextArea';




export interface WordListProps {
    articleId: string
    onSearchWord: (wordName: string) => void
}


const WordList: React.FC<WordListProps> = (props) => {
    const { articleId, onSearchWord } = props;

    const player = useRef();
    const source = useRef();
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [edidAcceVisible, setEditAcceVisible] = useState<boolean>(false);
    const [disableEdit, setDisableEdit] = useState<boolean>(false);
    const [word, setWord] = useState<WordCnItem>({});
    const [shortAcce, setShortAcce] = useState<string>("");

    useEffect(() => {
        getWords();
    }, [])

    const getWords = () => {
        props.dispatch({
            type: 'wordChinese/getWordByArticle',
            payload: articleId
        }).then((res) => {
            if (res) {
                if (res.success) {
                    props.setWordsNum(props.wordChinese.words.length);
                }
            }
        })
    }
    const loading = props.loading.effects["wordChinese/getWordByArticle"];

    const openEditModel = (item: WordCnItem, single: boolean) => {
        setEditModalVisible(true);
    }

    const handleSumbit = async () => {
        setDisableEdit(true)
        word["shortAcce"] = shortAcce;
        const res = await editWord(word);
        setDisableEdit(false)
        setEditAcceVisible(false)
    }

    return (
        <>
            <div className={styles.module}>
                <div className={styles.moduleTitle}>生字列表</div>
                <div className={styles.toolbar}>
                    <PlusCircleOutlined title='增加生字' onClick={() => { openEditModel({}, true) }} />
                </div>
            </div>
            <Spin spinning={loading}>
                <div className={styles.wordList}>
                    {props.wordChinese.words.length > 0 ?
                        <ul>
                            {props.wordChinese.words.map((item: WordCnItem) => (
                                <li key={item.id} className={styles.row}>
                                    <ul>
                                        <li className={styles.wordName} onClick={() => onSearchWord(item.wordName!)}>
                                            {item.wordName}
                                        </li>
                                        <li className={styles.phAm}>
                                            {item.pinYin}
                                        </li>
                                        <li className={styles.acceptation} onClick={() => {
                                            setWord(item);
                                            setShortAcce(item.shortAcce?item.shortAcce:item.acceptation);
                                            setEditAcceVisible(true)
                                        }}>
                                            {item.shortAcce ? item.shortAcce : item.acceptation?.split("|").join(" ")}
                                        </li>
                                    </ul>
                                </li>

                            ))}
                        </ul> : <Empty></Empty>}
                </div>
            </Spin>
            <audio ref={player}>
                <source ref={source} src="" type="audio/mpeg" />
                您的浏览器不支持 audio 元素。
            </audio>
            <WordEditModal modalVisible={editModalVisible} articleId={articleId}
                onCancel={(reload) => {
                    reload && getWords();
                    setEditModalVisible(false);
                }}></WordEditModal>

            <Modal
                closable={false}
                visible={edidAcceVisible}
                style={{ top: 20 }}
                footer={<>
                    <Button type="primary" onClick={handleSumbit} disabled={disableEdit}>
                        保存
                    </Button>
                    <Button onClick={() => setEditAcceVisible(false)}>取消</Button>
                </>}
            >
                <TextArea rows={10} value={shortAcce} onChange={e=>setShortAcce(e.currentTarget.value)}></TextArea>
            </Modal>
        </>
    );
};

export default connect(({ wordChinese, loading }: { wordChinese, loading }) => (
    { wordChinese, loading })
)(WordList);