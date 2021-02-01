import React, { useState, useEffect, useRef } from 'react';
import { getArticle } from '../service';
import { Modal, Button } from 'antd';
import styles from './articleDetail.less';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CreateForm from '../components/CreateForm';
import WordList from '../components/wordList';
import SentenceList from '../components/sentenceList';


export interface ArticleDetailProps {
  match: object
}


const ArticleDetail: React.FC<ArticleDetailProps> = (props) => {
  const { id } = props.match.params;
  const [article, setArticle] = useState<object>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const createForm = useRef();

  const player = useRef();
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

  const play = (src: string) => {
    console.log(src);
    if (src) {
      source.current.src = src;
      player.current!.load();
      player.current!.play();
    }
  }

  return (
    <>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.title}><h1>{article.title}</h1></div>
          <div className={styles.toolbar}>
            <ArrowLeftOutlined /><EditOutlined onClick={openEditModel} /><DeleteOutlined />
          </div>
        </header>

        <div className={styles.moduleTitle}>详细信息</div>
        <div className={styles.info}>
          <div className={styles.left}>
            {article.mp3 ? <div className={styles.infoItem}>
              <audio controls>
                <source src={article.mp3} type="audio/mpeg" />
                    您的浏览器不支持 audio 元素。
              </audio>
            </div> : ''}
            <div className={styles.infoItem}>
              <div className={styles.itemLabel}>句子数</div>
              <div className={styles.itemValue}>0</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.itemLabel}>单词数</div>
              <div className={styles.itemValue}>0</div>
            </div>
          </div>
          {article.picture ?
            <a target='_blank' className={styles.right} href={article.picture}>
              <img className={styles.img} src={article.picture} />
            </a> : ''}
        </div>

        <SentenceList articleId={id} play={play} edit={true}></SentenceList>
        <WordList articleId={id}></WordList>

      </main>
      <Modal title="查看图片" width={660} visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false); }}
        footer={
          <Button onClick={() => { setIsModalVisible(false); }}>
            关闭
            </Button>
        }>
        <img width={600} src={article.picture}></img>
      </Modal>
      <CreateForm ref={createForm} onCancel={(result) => {
        setEditModalVisible(false);
        result && getArticleDetail();
      }}
        modalVisible={editModalVisible}>
      </CreateForm>
      <audio ref={player}>
        <source ref={source} type="audio/mpeg" />
                  您的浏览器不支持 audio 元素。
            </audio>
    </>
  );
};

export default ArticleDetail;
