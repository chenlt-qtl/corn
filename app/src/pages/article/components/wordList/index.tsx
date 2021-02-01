import React, { useState, useEffect } from 'react';
import { Empty, Spin } from 'antd';
import styles from './styles.less';
import { WordItem } from '../../data.d';
import { PlayCircleOutlined } from '@ant-design/icons';
import WordPopover from '../wordPopover';
import { connect, WordState } from 'umi';



export interface WordListProps {
    articleId: string
}


const WordList: React.FC<WordListProps> = (props) => {
    const { articleId } = props;
    const [words, setWords] = useState<WordItem[]>([]);

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
                    setWords(res.result.records);
                }
            }
        })
    }
    const loading = props.loading.effects["word/getWordByArticle"];

    return (
        <>
            <div className={styles.module}>
                <div className={styles.moduleTitle}>单词列表</div>
            </div>
            <Spin spinning={loading}>
                <div className={styles.wordList}>
                    {words.length > 0 ?
                        <ul>
                            {words.map((item: WordItem) => (
                                <li key={item.id} className={styles.row}>
                                    <ul>
                                        <li className={styles.wordName}>
                                            <WordPopover wordName={item.wordName}>
                                                {item.wordName}
                                            </WordPopover>
                                        </li>
                                        <li className={styles.phAm}>
                                            <WordPopover wordName={item.wordName}>
                                                /{item.phAm}/
                                            </WordPopover>
                                        </li>
                                        <li className={styles.play}><PlayCircleOutlined /></li>
                                        <li className={styles.acceptation}>
                                            <WordPopover wordName={item.wordName}>
                                                {item.acceptation}
                                            </WordPopover>
                                        </li>
                                    </ul>
                                </li>

                            ))}
                        </ul> : <Empty></Empty>}
                </div>
            </Spin>
        </>
    );
};

export default connect(({ word, loading }: { word: WordState, loading }) => (
    { word, loading })
)(WordList);