import React, { useEffect, useRef, useState } from 'react';

import { Empty, Spin } from 'antd';
import styles from './styles.less';
import { WordItem } from '../data';
import { PlusCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import WordEditModal from './WordEditModal';



export interface WordListProps {
    articleId: string
    onSearchWord: (wordName: string) => void
}


const WordList: React.FC<WordListProps> = (props) => {
    const { articleId, onSearchWord } = props;

    const player = useRef();
    const source = useRef();
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);


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

    const openEditModel = (item: WordItem, single: boolean) => {
        setEditModalVisible(true);
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
                            {props.wordChinese.words.map((item: WordItem) => (
                                <li key={item.id} className={styles.row}>
                                    <ul>
                                        <li className={styles.wordName} onClick={() => onSearchWord(item.wordName!)}>
                                            {item.wordName}
                                        </li>
                                        <li className={styles.phAm}>
                                            {item.pinYin}
                                        </li>
                                        <li className={styles.acceptation}>
                                            {item.acceptation?.split("|").join(" ")}
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
        </>
    );
};

export default connect(({ wordChinese, loading }: { wordChinese, loading }) => (
    { wordChinese, loading })
)(WordList);