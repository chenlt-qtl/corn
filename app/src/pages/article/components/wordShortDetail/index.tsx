import React, { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import styles from './styles.less';
import { WordItem } from '../../data';
import { connect, history } from 'umi';
import 'font-awesome/css/font-awesome.min.css';



export interface WordShortDetailProps {
    wordName: string;
}


const WordShortDetail: React.FC<WordShortDetailProps> = (props) => {
    const { wordName } = props;
    const [word, setWord] = useState < WordItem > ({});
    const player = useRef();
    const [message, setMessage] = useState < String > ("");
    useEffect(() => {
        setMessage("")
        const word = props.word.wordMap.get(wordName);
        if (word) {
            setWord(word);
        } else {
            props.dispatch({
                type: 'word/getWordByWordName',
                payload: wordName
            }).then((res) => {
                if (res) {
                    setWord(res);
                } else {
                    setMessage("未查询到相关单词")
                }
            })
        }
    }, [wordName])

    const play = () => {
        player.current!.play();
    }

    const handleMore = () => {

        history.push('/word/' + word.wordName)
    }


    const loading = props.loading.effects["word/getWordByWordName"];

    return (
        <><Spin spinning={loading}>
            {message ? message :
                <ul className={styles.content}>

                    <li className={styles.wordName}>
                        {word.wordName}
                        <span onClick={handleMore}>更多释义<i className="fa fa-angle-double-right"></i></span>
                    </li>
                    <li className={styles.phAm}>/{word.phAm}/ <i className="fa fa-volume-up" onClick={play}></i></li>
                    <li className={styles.acceptation}>{word.acceptation && word.acceptation.split('|').map(item => item ? (item + '\n') : '')}</li>
                </ul>}
        </Spin>
            <audio ref={player}>
                <source src={word.mp3} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio>
        </>
    );
};

export default connect(({ loading, word }: { loading, word }) => (
    { loading, word })
)(WordShortDetail);