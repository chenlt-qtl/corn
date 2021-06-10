import React, { useState, useEffect } from 'react';
import { getSentenceByArticle } from '../../service';
import { List, Popconfirm, Spin, message, Drawer, Pagination } from 'antd';
import styles from './styles.less';
import { PlusCircleOutlined, EditOutlined, PlayCircleOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { SentenceItem } from '../../data.d';
import EditModal from './EditModal';
import { removeSentence } from '../../service';
import {  splipSentences } from '../../utils'
import WordShortDetail from '../wordShortDetail';
import WordDetail from '../../wordDetail';



export interface SentenceListProps {
    articleId: string
    play: (mp3: string) => void
    edit: boolean
}


const SentenceList: React.FC<SentenceListProps> = (props) => {
    const { articleId, play, edit = false } = props;
    const [sentences, setSentences] = useState < SentenceItem[] > ([]);
    const [sentence, setSentence] = useState < SentenceItem > ({});
    const [editModalVisible, setEditModalVisible] = useState < boolean > (false);
    const [single, setSingle] = useState < boolean > (true);
    const [loading, setLoading] = useState < boolean > (true);

    const [wordName, setWordName] = useState < string > ('');
    const [drawerVisible, setDrawerVisible] = useState < boolean > (false);

    const [total, setTotal] = useState < number > (0);
    const [pageNo, setPageNo] = useState < number > (0);

    const [wordModalVisible, setWordModalVisible] = useState < boolean > (false);


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

    const openEditModel = (item: SentenceItem, single: boolean) => {
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
        const actions = [
            <EditOutlined onClick={() => { openEditModel(item, true) }} />,];
        if (item.mp3) {
            actions.push(<PlayCircleOutlined />);
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

    const transSentence = (content: string) => {
        const sentences = splipSentences([content]);
        const result = sentences.length > 0 && sentences[0].allWords.map(word => {
            const text = word.text;
            if (word.isWord) {
                return <span className={styles.words} onClick={() => getWords(text)}>
                    &nbsp;{text}
                </span>
            } else {
                return text;
            }
        })
        return result;
    }

    const getWords = (wordName: string) => {
        setWordName(wordName)
        setDrawerVisible(true)
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
                pagination={false}
                dataSource={sentences}
                renderItem={(item: SentenceItem) => (
                    <List.Item className={styles.item}
                        key={item.id}
                        actions={getActions(item)}
                    >
                        <pre>{transSentence(item.content)}
                            {item.mp3 ? <i className={`fa fa-volume-up ${styles.trumpet}`} onClick={() => play(item.mp3)}></i> : ''}</pre>
                    </List.Item>
                )}
            />
            <Pagination className={styles.page} size="small" total={total} showSizeChanger={false}
                onChange={(page = 1) => {
                    setPageNo(page);
                }} />
            {edit ? <EditModal articleId={articleId} sentence={sentence} single={single}
                onCancel={(reload) => {
                    reload && getSentence();
                    setEditModalVisible(false);
                }}
                modalVisible={editModalVisible}></EditModal> : ''}
            <Drawer
                title={wordName}
                placement="right"
                closable={false}
                visible={drawerVisible}
                onClose={() => { setDrawerVisible(false) }}
            >
                <WordShortDetail wordName={wordName} />
            </Drawer>
            <WordDetail wordName={wordName} isModalVisible={wordModalVisible} hideWordModal={()=>setWordModalVisible(false)}/>
        </Spin>
    );
};

export default SentenceList;
