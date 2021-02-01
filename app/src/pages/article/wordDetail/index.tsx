import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Spin, Tabs, Anchor, Empty } from 'antd';
import styles from './styles.less';
import { WordItem, IcibaSentenceItem, SentenceItem } from '../data';
import { connect, history } from 'umi';
import 'font-awesome/css/font-awesome.min.css';
import { StarFilled, StarOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;
const { Link } = Anchor;

export interface WordDetailProps {
    match: { params: { wordName: string } }
}


const WordDetail: React.FC<WordDetailProps> = (props) => {
    const { wordName } = props.match.params;
    const [word, setWord] = useState<WordItem>({});
    const [moreSentence, setMoreSentence] = useState<SentenceItem[]>([]);//更多例句
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
            }
        })

        props.dispatch({
            type: 'word/getSentenceByWord',
            payload: wordName
        }).then((res: SentenceItem[]) => {
            if (res) {
                setMoreSentence(res);
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
        // console.log(index);
        // if (index >= 0 && refs[index]) {
        //     refs[index].current.scrollIntoView();
        // }
        history.push('#aaa');
    }

    const saveRel = () => {

    }

    const loading = props.loading.effects["word/getWordFromDb"];
    const moreLoading = props.loading.effects["word/getSentenceByWord"];
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
                    <nav id='acceptation'>
                        <Anchor targetOffset={30}>
                            <Link href="#acceptation" title="解释" />
                            <Link href="#cblj" title="词霸例句" />
                            <Link href="#zdylj" title="自定义例句" />
                            <Link href="#gdlj" title="全部例句" />
                        </Anchor>
                    </nav>
                    <section className={styles.acceptation}>{word.acceptation}</section>
                    <section className={styles.acceptation}>
                        {word.icibaSentences ?
                            <>
                                <div id="cblj" ref={refs[0]} className={styles.title}>
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
                                <div id='zdylj' ref={refs[1]} className={styles.title}>
                                    自定义例句
                                </div>
                                {word.sentences.map((item: SentenceItem, index: number) => (
                                    <div className={styles.sentence} key={item.id}>
                                        <section className={styles.content}>{index + 1}.   <span>{item.content}{item.mp3 ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={() => play(item.mp3)}></i> : ''}</span></section>
                                        {item.picture ? <section className={styles.img}><img src={item.picture}></img></section> : ''}
                                    </div>
                                ))}
                            </> : ''}
                    </section>
                    <section className={styles.acceptation}>
                        <div id='gdlj' ref={refs[1]} className={styles.title}>
                            全部例句
                        </div>
                        <Spin spinning={moreLoading}>
                            {moreSentence.length > 0 ?
                                moreSentence.map((item: SentenceItem, index: number) => (
                                    <div className={styles.sentence} key={item.id}>
                                        <section className={styles.content}>{index + 1}.   <span>{item.content}{item.mp3 ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={() => play(item.mp3)}></i> : ''}</span></section>
                                        {item.picture ? <section className={styles.img}><img src={item.picture}></img></section> : ''}
                                    </div>
                                ))
                                : <Empty></Empty>}
                        </Spin>
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