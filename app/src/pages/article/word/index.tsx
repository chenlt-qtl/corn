import React, { useState, useEffect } from 'react';
import { getWordByArticle } from '../service';
import { Empty } from 'antd';
import styles from '../articleDetail.less';
import { WordItem } from '../data.d';
import { PlayCircleOutlined } from '@ant-design/icons';




export interface WordProps {
    articleId: string
}


const Word: React.FC<WordProps> = (props) => {
    const articleId = props.articleId;
    const [words, setWords] = useState<WordItem[]>([]);

    useEffect(() => {
        getWords();
    }, [])

    const getWords = () => {
        getWordByArticle(articleId).then(res => {
            if (res) {
                if (res.success) {
                    setWords(res.result.records);
                }
            }
        })
    }


    return (
        <>
            <div className={styles.module}>
                <div className={styles.moduleTitle}>单词列表</div>
            </div>
            <div className={styles.wordList}>
                {words.length > 0 ?
                    <ul>
                        {words.map((item: WordItem) => (
                            <li key={item.id} className={styles.row}>
                                <ul>
                                    <li className={styles.wordName}>{item.wordName}</li>
                                    <li className={styles.phAm}>{item.phAm}</li>
                                    <li className={styles.play}><PlayCircleOutlined/></li>
                                    <li className={styles.acceptation}>{item.acceptation}</li>
                                </ul>
                                </li>
                        ))}
                    </ul> : <Empty></Empty>}
            </div>
        </>
    );
};

export default Word;
