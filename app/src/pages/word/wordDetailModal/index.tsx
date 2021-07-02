import React, { useState, useEffect, useRef } from 'react';
import { Spin, Anchor, Empty, Modal, Button } from 'antd';
import styles from './styles.less';
import { WordItem, IcibaSentenceItem, SentenceItem } from '../data';
import { connect } from 'umi';
import 'font-awesome/css/font-awesome.min.css';
import { StarFilled, StarOutlined } from '@ant-design/icons';


const { Link } = Anchor;

export interface WordDetailProps {
    wordName: string
    isModalVisible: boolean
    hideWordModal: () => void
}


const wordDetailModal: React.FC<WordDetailProps> = (props) => {
    const { wordName } = props.match ? props.match.params : props;
    const [word, setWord] = useState<WordItem>({});
    const [moreSentence, setMoreSentence] = useState<SentenceItem[]>([]);//更多例句
    const player = useRef();
    const source = useRef();
    const refs = [useRef(), useRef()];

    useEffect(() => {
        if (wordName) {
            props.dispatch({
                type: 'word/getWordByWordName',
                payload: wordName
            }).then((res: WordItem) => {
                if (res) {
                    setWord(res);
                }
            })
        }
    }, [wordName])

    const play = (src: string | undefined) => {
        console.log(src);
        if (src) {
            source.current.src = src;
        }
        player.current!.load();
        player.current!.play();
    }

    const saveRel = () => {

    }

    const loading = props.loading.effects["word/getWordByWordName"];
    const reg = /^[\s]/;
    return (
        <Modal title="单词详情" width={660} visible={props.isModalVisible}
            onCancel={() => { props.hideWordModal(); }}
            footer={
                <Button onClick={() => { props.hideWordModal(); }}>
                    关闭
                </Button>
            }>
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
                                        {index + 1}. &nbsp;<span>{item.orig.replace(reg, '')}</span>
                                        <p>{item.trans.replace(reg, '')}</p>
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
                    
                </main>
            </Spin>
            <audio ref={player}>
                <source ref={source} src={word.phAnMp3} type="audio/mpeg" />
                您的浏览器不支持 audio 元素。
            </audio>
        </Modal>
    );
};

export default connect(({ loading }: { loading }) => (
    { loading }))(wordDetailModal);