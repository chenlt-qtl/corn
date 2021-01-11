import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Spin, Tabs } from 'antd';
import styles from './styles.less';
import { WordItem, IcibaSentenceItem, SentenceItem } from '../data';
import { connect } from 'umi';
import 'font-awesome/css/font-awesome.min.css';
import { StarFilled, StarOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;

export interface WordDetailProps {
    match: { params: { wordName: string } }
}


const WordDetail: React.FC<WordDetailProps> = (props) => {
    const { wordName } = props.match.params;
    const [word, setWord] = useState<WordItem>({});
    const player = useRef();
    const source = useRef();
    const refs = [useRef(), useRef()];

    useEffect(() => {
        props.dispatch({
            type: 'word/getWordFromDb',
            payload: wordName
        }).then((res: WordItem) => {
            if (res) {
                setWord(res);
                console.log(res);
            }
        })
    }, [])

    const play = (src: string | undefined) => {
        console.log(src);
        if (src) {
            source.current.src = src;
        }
        player.current!.load();
        player.current!.play();
    }

    const handleTabChange = (index: number) => {
        console.log(index);
        if (index >= 0 && refs[index]) {
            refs[index].current.scrollIntoView();
        }
    }

    const saveRel = () => {

    }

    const loading = props.loading.effects["word/getWordFromDb"];
    const reg = /^[\s]/;
    return (
        <>
            <Spin spinning={loading}>
                <main className={styles.word}>
                    <header className={styles.wordName}>{word.wordName}
                        <div className={styles.star}>
                            {word.wordUserRel ?
                                <StarFilled className={styles.favorate} /> :
                                <StarOutlined onClick={saveRel} className={styles.notFavorate} />}
                        </div>
                    </header>
                    <section className={styles.phAm}>/{word.phAm}/<i className={`fa fa-volume-up ${styles.trumpet}`} onClick={() => { play(word.phAnMp3) }}></i></section>
                    <nav>
                        <Tabs defaultActiveKey="-1" onChange={handleTabChange}>
                            <TabPane tab="解释" key="-1" />
                            <TabPane tab="词霸例句" key="0" />
                            <TabPane tab="自定义例句" key="1" />
                        </Tabs>
                    </nav>
                    <section className={styles.acceptation}>{word.acceptation}</section>
                    <section className={styles.acceptation}>
                        {word.icibaSentences ?
                            <>
                                <div ref={refs[0]} className={styles.title}>
                                    词霸例句
                                </div>
                                {word.icibaSentences.map((item: IcibaSentenceItem, index: number) => (
                                    <div className={styles.sentence} key={item.id}>
                                        {index + 1}.   <span>{item.orig.replace(reg, '')}{item.trans.replace(reg, '')}</span>
                                    </div>
                                ))}
                            </> : ''}
                    </section>
                    <section className={styles.acceptation}>
                        {word.sentences ?
                            <>
                                <div ref={refs[1]} className={styles.title}>
                                    自定义例句
                                </div>
                                {word.sentences.map((item: SentenceItem, index: number) => (
                                    <div className={styles.sentence} key={item.id}>
                                        <section className={styles.content}>{index + 1}.   <span>{item.content}{item.mp3 ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={() => play(item.mp3)}></i> : ''}</span></section>
                                        <section className={styles.img}>{item.picture ? <img src={item.picture}></img>:''}</section>
                                    </div>
                                ))}
                            </> : ''}
                    </section>
                </main>
            </Spin>
            <audio ref={player}>
                <source ref={source} src={word.phAnMp3} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio>
        </>
    );
};

export default connect(({ loading }: { loading }) => (
    { loading }))(WordDetail);