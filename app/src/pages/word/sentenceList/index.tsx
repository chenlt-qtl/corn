import React, { useState, useEffect } from 'react';
import { getSentenceByArticle, removeSentence } from '@/services/article';
import { List, Popconfirm, Spin, message } from 'antd';
import styles from './styles.less';
import { PlusCircleOutlined, EditOutlined, PlayCircleOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { SentenceItem } from '@/data/word';
import SentenceEditModal from './SentenceEditModal';
import { splipSentences, timeIntervalReg as reg, getMp3Time } from '@/utils/wordUtils'
import { connect, WordState } from 'umi';

export interface SentenceListProps {
    articleId: string
    articleMp3: string
    onSearchWord: (wordName: string) => void
    play: (mp3: string) => void
    edit: boolean
}


const SentenceList: React.FC<SentenceListProps> = (props) => {
    const { articleId, articleMp3, play, onSearchWord, edit = false } = props;
    const [sentences, setSentences] = useState<SentenceItem[]>([]);
    const [sentence, setSentence] = useState<SentenceItem>({});
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [single, setSingle] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

    const [pageNo, setPageNo] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);



    useEffect(() => {
        getSentence();
    }, [pageNo])

    const getSentence = () => {
        getSentenceByArticle({ articleId, pageNo, pageSize: 10 }).then(res => {
            if (res) {
                setLoading(false)
                if (res.success && res.result) {
                    setSentences(res.result.records);
                    setTotal(res.result.total)
                    props.setSenteceNum(res.result.total)
                }
            }
        })
    }

    const getWords = () => {
        props.dispatch({
            type: 'word/getWordByArticle',
            payload: articleId
        }).then((res) => {
            if (res) {
                if (res.success) {
                    props.setWordsNum(props.word.words.length);
                }
            }
        })
    }

    const openEditModel = (item: SentenceItem, single: boolean) => {
        if (!item.mp3Time) {
            item.mp3Time = getMp3Time(item.content || "")
        }
        setSentence(item);
        setEditModalVisible(true);
        setSingle(single);
    }

    const handleDel = async (id: string) => {
        setLoading(true);
        const res = await removeSentence(id);
        if (res && res.success) {
            message.success('删除成功');
            getSentence();
        } else {
            message.error('删除失败');
        }

        setLoading(false);
    }

    const getActions = (item: SentenceItem): React.ReactNode[] => {

        const actions = [<>{item.idx}</>,
        <EditOutlined onClick={() => { openEditModel(item, true) }} />,];
        if (item.mp3) {
            actions.push(<PlayCircleOutlined />);
        }
        if (item.mp3Time) {
            const timeArr = item.mp3Time.split(",")
            actions.push(<>Mp3 Time: {timeArr[0]} - {parseFloat(timeArr[1]) + parseInt(timeArr[0])}</>)
        }
        actions.push(
            <Popconfirm
                title="确认要删除这个句子?"
                onConfirm={() => { handleDel(item.id!) }}
                okText="是"
                cancelText="否"
            >
                <DeleteOutlined />
            </Popconfirm>
        );
        return actions;
    }

    const hasMp3 = (sentence: SentenceItem) => {
        if (sentence.mp3) {
            return true;
        }

        if (articleMp3 && sentence.mp3Time) {
            return true;
        }
        return false;

    }

    const playMp3 = (sentence: SentenceItem) => {
        if (sentence.mp3) {
            play(sentence.mp3)
        } else {
            //如果数据库里有存时间，就使用数据库时间
            if (sentence.mp3Time) {
                const mp3Time = sentence.mp3Time;
                const timeArr = mp3Time.split(",");
                if (timeArr.length == 2) {
                    play(null, timeArr[0], timeArr[1]);
                }
            }
        }
    }

    const transSentence = (content: string) => {
        const sentences = splipSentences([content.replace(reg, "")]);
        const result = sentences.length > 0 && sentences[0].allWords.map((word, index) => {
            const text = word.text;
            const isRelated = props.word.wordNames.includes(text.toLowerCase())
            if (word.isWord) {
                return <span key={text + index} className={`${styles.words} ${isRelated ? styles.related : ''}`} onClick={() => onSearchWord(text)}>
                    {text}
                </span>
            } else {
                return text;
            }
        })
        return result;
    }

    return (
        <Spin spinning={loading}>
            {edit ? <div className={styles.module}>
                <div className={styles.moduleTitle}>句子列表</div>
                <div className={styles.toolbar}>
                    <PlusCircleOutlined title='增加句子' onClick={() => { openEditModel({}, true) }} />
                    <FileAddOutlined title='批量增加句子' onClick={() => { openEditModel({}, false) }} />
                </div>
            </div> : ''}
            <List
                className={styles.sentenceList}
                itemLayout="vertical"
                size="large"
                pagination={{
                    showSizeChanger: false,
                    total,
                    className: styles.page,
                    size: "small",
                    onChange: (page = 1) => {
                        setPageNo(page);
                    }
                }}
                dataSource={sentences}
                renderItem={(item: SentenceItem) => (
                    <List.Item className={styles.item}
                        key={item.id}
                        actions={getActions(item)}
                    >
                        <pre>{transSentence(item.content)}
                            {hasMp3(item) ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={() => playMp3(item)}></i>
                                : ''}</pre>
                    </List.Item>
                )}
            />

            {edit ? <SentenceEditModal articleId={articleId} sentence={sentence} single={single} hasArticleMp3={!!articleMp3}
                onPlay={playMp3}
                onCancel={(reload) => {
                    reload && getSentence();
                    reload && getWords();
                    setEditModalVisible(false);
                }}
                modalVisible={editModalVisible}></SentenceEditModal> : ''}
        </Spin>
    );
};


export default connect(({ word, loading }: { word: WordState, loading }) => (
    { word, loading })
)(SentenceList);