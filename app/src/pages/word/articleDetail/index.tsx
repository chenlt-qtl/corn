import React, { useState, useEffect, useRef } from 'react';
import { getArticle } from '@/services/article';
import { Modal, Button, Popconfirm } from 'antd';
import styles from './styles.less';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ArticleEditModal from '../articleEditModal';
import WordList from '../wordList';
import SentenceList from '../sentenceList';
import WordDetailModal from '../wordDetailModal';
import { Link, history, connect } from 'umi';
import { doPlay } from '@/utils/wordUtils'


export interface ArticleDetailProps {
    match: object
}


const ArticleDetail: React.FC<ArticleDetailProps> = (props) => {
    const { id } = props.match.params;
    const [article, setArticle] = useState<object>({});
    const [imgModalVisible, setImgModalVisible] = useState<boolean>(false);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [wordModalVisible, setWordModalVisible] = useState<boolean>(false);

    const [sentenceNum, setSentenceNum] = useState<number>(0);
    const [wordsNum, setWordsNum] = useState<number>(0);

    const [wordName, setWordName] = useState<string>("");

    const createForm = useRef();

    const player1 = useRef();
    const player2 = useRef();
    const source = useRef();

    useEffect(() => {
        getArticleDetail();
    }, [])

    const getArticleDetail = () => {
        getArticle(id).then(res => {
            if (res) {
                if (res.success) {
                    setArticle(res.result.article);
                }
            }
        })
    }

    const openEditModel = () => {
        createForm.current.setFormValue(article);
        setEditModalVisible(true);
    }

    const play = (src: string, startTime: number = 0, endTime: number = 0) => {
        let player;
        
        if (src) {
            player = player2.current;//有播放源的用player2
            player1.current!.pause();
            source.current!.src = src;
            player.load();
            
        } else {
            player = player1.current;//没有播放源的用player1
            player2.current!.pause();
        }
        
        doPlay(player,startTime,endTime,1)

    }

    
    const onSearchWord = (wordName: string) => {
        if (wordName) {
            setWordName(wordName);
            setWordModalVisible(true)
        }
    }

    const delArticle = () => {
        props.dispatch({
            type: 'word/removeArticle',
            payload: id
        }).then((res) => {
            if (res) {
                history.push('/page/article/list');
            }
        })
    }

    return (
        <>
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.title}><h1>{article.title}</h1></div>
                    <div className={styles.toolbar}>
                        <Link to="/page/article/list"><ArrowLeftOutlined /></Link>
                        <EditOutlined onClick={openEditModel} />
                        <Popconfirm
                            title="确认要删除这篇文章?"
                            onConfirm={delArticle}
                            okText="是"
                            cancelText="否"
                        ><DeleteOutlined /></Popconfirm>
                    </div>
                </header>

                <div className={styles.moduleTitle}>详细信息</div>
                <div className={styles.info}>
                    <div className={styles.left}>
                        {article.mp3 ? <div className={styles.infoItem}>
                            <audio controls ref={player1}>
                                <source src={article.mp3} type="audio/mpeg" />
                                您的浏览器不支持 audio 元素。
                            </audio>
                        </div> : ''}
                        <div className={styles.infoItem}>
                            <div className={styles.itemLabel}>句子数</div>
                            <div className={styles.itemValue}>{sentenceNum}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.itemLabel}>单词数</div>
                            <div className={styles.itemValue}>{wordsNum}</div>
                        </div>
                    </div>
                    {article.picture ?
                        <a target='_blank' className={styles.right} href={article.picture}>
                            <img className={styles.img} src={article.picture} />
                        </a> : ''}
                </div>

                <SentenceList articleId={id} articleMp3={article.mp3} onSearchWord={onSearchWord} setSenteceNum={setSentenceNum} setWordsNum={setWordsNum} play={play} edit={true}></SentenceList>
                <WordList articleId={id} onSearchWord={onSearchWord} setWordsNum={setWordsNum}></WordList>

            </main>
            <Modal title="查看图片" width={660} visible={imgModalVisible}
                onCancel={() => { setImgModalVisible(false); }}
                footer={
                    <Button onClick={() => { setImgModalVisible(false); }}>
                        关闭
                    </Button>
                }>
                <img width={600} src={article.picture}></img>
            </Modal>
            <ArticleEditModal ref={createForm} onCancel={(result: boolean) => {
                setEditModalVisible(false);
                result && getArticleDetail();
            }}
                modalVisible={editModalVisible}>
            </ArticleEditModal>
            <audio ref={player2}>
                <source ref={source} type="audio/mpeg" />
                您的浏览器不支持 audio 元素。
            </audio>

            <WordDetailModal wordName={wordName} articleId={id} isModalVisible={wordModalVisible} hideWordModal={() => setWordModalVisible(false)} />

        </>
    );
};

export default connect()(ArticleDetail);