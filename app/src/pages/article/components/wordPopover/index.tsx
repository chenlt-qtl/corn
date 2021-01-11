import React, { useState, useEffect, useRef } from 'react';
import { Popover, Spin } from 'antd';
import styles from './styles.less';
import { WordItem } from '../../data';
import { connect,history } from 'umi';
import 'font-awesome/css/font-awesome.min.css';



export interface WordPopoverProps {
    wordName: string;
}


const WordPopover: React.FC<WordPopoverProps> = (props) => {
    const { wordName } = props;
    const [word, setWord] = useState<WordItem>({});
    const player = useRef();

    useEffect(() => {
        props.dispatch({
            type: 'word/getWordByWordName',
            payload: wordName
        }).then((res) => {
            if (res) {
                setWord(res);
            }
        })
    }, [])

    const play = () => {
        player.current!.play();
    }

    const handleMore = ()=>{

        history.push('/word/'+word.wordName)
    }


    const loading = props.loading.effects["word/getWordByWordName"];

    const content = (
        <ul className={styles.content}>
            <Spin spinning={loading}>
                <li className={styles.wordName}>
                    {word.wordName}
                    <span onClick={handleMore}>更多释义<i className="fa fa-angle-double-right"></i></span>
                </li>
                <li className={styles.phAm}>/{word.phAm}/ <i className="fa fa-volume-up" onClick={play}></i></li>
                <li className={styles.acceptation}>{word.acceptation}</li>
            </Spin>
        </ul>
    );

    return (
        <>
            <Popover content={content} placement="bottomLeft" >
                {props.children}
            </Popover>
            <audio ref={player}>
                <source src={word.mp3} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio>
        </>
    );
};

export default connect(({ loading }: { loading }) => (
    { loading })
)(WordPopover);