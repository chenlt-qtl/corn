import React, { useEffect, useRef, useState } from 'react';

import { Empty, Spin } from 'antd';
import styles from './styles.less';
import { WordItem } from '../data.d';
import { PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { connect, WordState } from 'umi';
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
            type: 'word/getWordByArticle',
            payload: articleId
        }).then((res) => {
            if (res) {
                if (res.success) {
                    props.setWordsNum(props.word.words.length);
                }
            }
        })
    }
    const loading = props.loading.effects["word/getWordByArticle"];

    const openEditModel = (item: WordItem, single: boolean) => {
        setEditModalVisible(true);
    }

    const play = (src: string | undefined) => {
        console.log(src);
        if (src) {
            source.current.src = src;
        }
        player.current!.load();
        player.current!.play();
    }

    return (
        <>
            <div className={styles.module}>
                <div className={styles.moduleTitle}>单词列表</div>
                <div className={styles.toolbar}>
                    <PlusCircleOutlined title='增加单词' onClick={() => { openEditModel({}, true) }} />
                </div>
            </div>
            <Spin spinning={loading}>
                <div className={styles.wordList}>
                    {props.word.words.length > 0 ?
                        <ul>
                            {props.word.words.map((item: WordItem) => (
                                <li key={item.id} className={styles.row}>
                                    <ul>
                                        <li className={styles.wordName} onClick={() => onSearchWord(item.wordName!)}>
                                            {item.wordName}
                                        </li>
                                        <li className={styles.play}><PlayCircleOutlined onClick={() => { play(item.mp3) }} /></li>
                                        <li className={styles.phAm}>
                                            /{item.phAm}/
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

export default connect(({ word, loading }: { word: WordState, loading }) => (
    { word, loading })
)(WordList);