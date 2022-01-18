import React, { useState, useEffect } from 'react';
import { Spin, Modal, Button } from 'antd';
import styles from './styles.less';
import { WordItem } from '../data';
import { connect } from 'umi';
import 'font-awesome/css/font-awesome.min.css';
import { StarFilled, StarOutlined } from '@ant-design/icons';


export interface WordDetailProps {
    wordName: string
    articleId: string
    isModalVisible: boolean
    hideWordModal: () => void
}


const wordDetailModal: React.FC<WordDetailProps> = (props) => {
    const { wordName, articleId } = props.match ? props.match.params : props;
    const [word, setWord] = useState<WordItem | null>({});
    const [relWithArticle, setRelWithArticle] = useState<boolean | undefined>(false);

    useEffect(() => {
        if (wordName) {
            props.dispatch({
                type: 'wordChinese/getWordByWordName',
                payload: { wordName, articleId }
            }).then((res: WordItem) => {
                if (res) {
                    setWord(res);
                    setRelWithArticle(res.relWithArticle);
                } else {
                    setWord(null);
                }
            })
        }
    }, [wordName])

    const updateArticleWordRel = async () => {
        let type;
        if (relWithArticle) {
            type = 'wordChinese/removeArticleWordRel'
        } else {
            type = 'wordChinese/addArticleWordRel'
        }
        props.dispatch({
            type,
            payload: { wordId: word.id, articleId }
        }).then((res) => {
            if (res.success) {
                setRelWithArticle(!relWithArticle);
            }
        })
    }

    const loading = props.loading.effects["wordChinese/getWordByWordName"] || false;
    return (
        <Modal title="汉字详情" width={660} visible={props.isModalVisible}
            onCancel={() => { props.hideWordModal(); }}
            footer={
                <Button onClick={() => { props.hideWordModal(); }}>
                    关闭
                </Button>
            }>
            <Spin spinning={loading}>
                {word ? <main className={styles.word}>
                    <header className={styles.wordName}>{word.wordName}
                        <div className={styles.star}>
                            {relWithArticle ?
                                <StarFilled onClick={updateArticleWordRel} className={styles.favorate} /> :
                                <StarOutlined onClick={updateArticleWordRel} className={styles.notFavorate} />}
                        </div>
                    </header>
                    <section className={styles.detail}>

                    </section>
                    <section className={styles.acceptation}>
                        {word.acceptation?.split("|").map((text, index) => <p key={index}>{text}</p>)}
                    </section>

                </main> : '未找到数据'}
            </Spin>
        </Modal>
    );
};

export default connect(({ loading }: { loading }) => (
    { loading }))(wordDetailModal);